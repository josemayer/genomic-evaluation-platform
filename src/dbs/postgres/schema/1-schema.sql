--- Change timezone to UTC-3 (São Paulo)
SET TIMEZONE TO 'America/Sao_Paulo';

DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS administrador CASCADE;
DROP TABLE IF EXISTS laboratorista CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS medico CASCADE;
DROP TABLE IF EXISTS tipo_painel CASCADE;
DROP TABLE IF EXISTS coleta CASCADE;
DROP TABLE IF EXISTS exame CASCADE;
DROP TYPE IF EXISTS TIPO_DE_ESTADO_DO_EXAME CASCADE;
DROP TABLE IF EXISTS andamento_exame CASCADE;
DROP TABLE IF EXISTS painel CASCADE;
DROP TABLE IF EXISTS condicao CASCADE;
DROP TABLE IF EXISTS condicao_sequencia_dna CASCADE;
DROP TABLE IF EXISTS identifica_condicao CASCADE;
DROP TABLE IF EXISTS pode_identifica_condicao CASCADE;
DROP TABLE IF EXISTS notificacao CASCADE;

CREATE TABLE usuario (
  id            BIGSERIAL,
  nome_completo TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  senha         TEXT        NOT NULL,

  CONSTRAINT usuario_pk PRIMARY KEY (id),
  CONSTRAINT usuario_email_unique UNIQUE (email)
);

CREATE TABLE administrador (
    usuario_id    BIGINT NOT NULL,

    CONSTRAINT admin_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT admin_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE laboratorista (
    usuario_id            BIGINT NOT NULL,
    numero_identificacao  BIGINT NOT NULL,

    CONSTRAINT laboratorista_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT laboratorista_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE cliente (
    usuario_id  BIGINT NOT NULL,
    telefone    VARCHAR(20),

    CONSTRAINT cliente_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT cliente_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE medico (
    usuario_id    BIGINT NOT NULL,
    registro_crm  BIGINT NOT NULL,

    CONSTRAINT medico_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT medico_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE notificacao (
    id          BIGSERIAL,
    usuario_id  BIGINT      NOT NULL,
    data        TIMESTAMP   NOT NULL,
    visualizado BOOL        DEFAULT false,
    texto       TEXT        NOT NULL,

    CONSTRAINT notificacao_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT notificacao_pk PRIMARY KEY (id)
);

CREATE TABLE tipo_painel (
    id        BIGSERIAL,
    descricao TEXT,

    CONSTRAINT tipo_painel_pk PRIMARY KEY (id)
);

CREATE TABLE coleta (
    id              BIGSERIAL,
    cliente_id      BIGINT      NOT NULL,
    data            TIMESTAMP   NOT NULL,

    CONSTRAINT coleta_cliente_fk FOREIGN KEY (cliente_id)
      REFERENCES cliente (usuario_id) ON DELETE CASCADE,
    CONSTRAINT coleta_pk PRIMARY KEY (id)
);


CREATE TABLE exame (
    id              BIGSERIAL,
    coleta_id       BIGINT      NOT NULL,
    tempo_estimado  INTERVAL    NOT NULL,
    tipo_painel_id  BIGINT      NOT NULL,

    CONSTRAINT exame_coleta_fk FOREIGN KEY (coleta_id)
      REFERENCES coleta (id) ON DELETE CASCADE,
    CONSTRAINT exame_tipo_painel_fk FOREIGN KEY (tipo_painel_id)
      REFERENCES tipo_painel (id),
    CONSTRAINT exame_pk PRIMARY KEY (id)
);

CREATE TYPE TIPO_DE_ESTADO_DO_EXAME
  AS ENUM('na fila', 'processado', 'invalidado', 'consulta',  'completo');

CREATE TABLE andamento_exame (
  usuario_id      BIGINT,
  exame_id        BIGINT,
  data            TIMESTAMP               NOT NULL,
  estado_do_exame TIPO_DE_ESTADO_DO_EXAME NOT NULL,

  CONSTRAINT andamento_exame_usuario_fk FOREIGN KEY (usuario_id)
    REFERENCES usuario (id),
  CONSTRAINT andamento_exame_exame_fk FOREIGN KEY (exame_id)
    REFERENCES exame (id) ON DELETE CASCADE,
  CONSTRAINT andamento_exame_pk PRIMARY KEY (exame_id, data)
);

CREATE TABLE painel (
    exame_id                      BIGINT,
    sequencia_de_codigo_genetico  TEXT    NOT NULL,

    CONSTRAINT painel_exame_fk FOREIGN KEY (exame_id)
      REFERENCES exame (id) ON DELETE CASCADE,
    CONSTRAINT painel_pk PRIMARY KEY (exame_id)
);

CREATE TABLE condicao (
    id              BIGSERIAL,
    descricao       TEXT        NOT NULL,
    nome            TEXT        NOT NULL,
    prob_populacao  FLOAT       NOT NULL,

    CONSTRAINT condicao_pk PRIMARY KEY (id)
);

CREATE TABLE condicao_sequencia_dna (
    condicao_id         BIGINT,
    sequencia_dna       TEXT,
    prob_seq            FLOAT   NOT NULL,
    prob_seq_dado_cond  FLOAT   NOT NULL,

    CONSTRAINT condicao_sequencia_dna_condicao_fk FOREIGN KEY (condicao_id)
      REFERENCES condicao (id) ON DELETE CASCADE,
    CONSTRAINT condicao_sequencia_dna_pk PRIMARY KEY (condicao_id, sequencia_dna)
);

CREATE TABLE identifica_condicao (
    exame_id        BIGINT,
    condicao_id     BIGINT,

    CONSTRAINT identifica_condicao_painel_fk FOREIGN KEY (exame_id)
      REFERENCES painel (exame_id) ON DELETE CASCADE,
    CONSTRAINT identifica_condicao_condicao_fk FOREIGN KEY (condicao_id)
      REFERENCES condicao (id),
    CONSTRAINT identifica_conexao_pk PRIMARY KEY (exame_id, condicao_id)
);

CREATE TABLE pode_identificar_condicao (
    tipo_painel_id  BIGSERIAL,
    condicao_id     BIGINT,

    CONSTRAINT pode_identificar_condicao_tipo_painel_fk FOREIGN KEY (tipo_painel_id)
      REFERENCES tipo_painel (id) ON DELETE CASCADE,
    CONSTRAINT pode_identificar_condicao_condicao_fk FOREIGN KEY (condicao_id)
      REFERENCES condicao (id)
);

--- Client view and triggers

DROP VIEW IF EXISTS ClienteView CASCADE;
DROP FUNCTION IF EXISTS functionInsertCliente() CASCADE;
DROP FUNCTION IF EXISTS functionDeleteCliente() CASCADE;
DROP FUNCTION IF EXISTS functionUpdateCliente() CASCADE;
DROP TRIGGER IF EXISTS triggerInsertCliente ON ClienteView CASCADE;
DROP TRIGGER IF EXISTS triggerDeleteCliente ON ClienteView CASCADE;
DROP TRIGGER IF EXISTS triggerUpdateCliente ON ClienteView CASCADE;

CREATE VIEW ClienteView AS
SELECT u.id, u.nome_completo, u.email, u.senha, c.telefone
FROM usuario u, cliente c
WHERE u.id = c.usuario_id;

CREATE FUNCTION functionInsertCliente() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('usuario_id_seq');
  END IF;

  INSERT INTO usuario (id, nome_completo, email, senha)
  VALUES (NEW.id, NEW.nome_completo, NEW.email, NEW.senha);

	INSERT INTO cliente (usuario_id, telefone)
	VALUES (NEW.id, NEW.telefone);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION functionDeleteCliente() RETURNS TRIGGER AS $$
BEGIN
	DELETE FROM cliente
	WHERE id = OLD.id;

	DELETE FROM usuario
	WHERE id = OLD.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION functionUpdateCliente() RETURNS TRIGGER AS $$
BEGIN
	UPDATE usuario
	SET nome_completo = NEW.nome_completo, email = NEW.email, senha = NEW.senha
	WHERE id = NEW.id;

	UPDATE cliente
	SET telefone = NEW.telefone
	WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER triggerInsertCliente
INSTEAD OF INSERT ON ClienteView
FOR EACH ROW EXECUTE PROCEDURE functionInsertCliente();

CREATE TRIGGER triggerDeleteCliente
INSTEAD OF DELETE ON ClienteView
FOR EACH ROW EXECUTE PROCEDURE functionDeleteCliente();

CREATE TRIGGER triggerUpdateCliente
INSTEAD OF UPDATE ON ClienteView
FOR EACH ROW EXECUTE PROCEDURE functionUpdateCliente();

--- Authorization of users

CREATE USER usuario WITH PASSWORD 'userpass';
CREATE USER system WITH PASSWORD 'syspass';

GRANT SELECT ON ALL TABLES IN SCHEMA public TO usuario;
GRANT INSERT, UPDATE ON ClienteView, coleta, exame, andamento_exame, pode_identificar_condicao, tipo_painel, condicao, condicao_sequencia_dna TO usuario;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO usuario;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO system;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO system;

--- EstadoDoExameView

DROP VIEW IF EXISTS EstadoExameView CASCADE;

CREATE VIEW EstadoExameView AS
WITH TempoUltimoEstado AS (
	SELECT exame_id, max(data) AS data
	FROM andamento_exame
	GROUP BY exame_id
)
SELECT ae.exame_id, ae.estado_do_exame
FROM andamento_exame ae, TempoUltimoEstado tu
WHERE ae.exame_id = tu.exame_id AND ae.data = tu.data;
