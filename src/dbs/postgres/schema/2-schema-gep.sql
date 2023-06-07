DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS administrador CASCADE;
DROP TABLE IF EXISTS laborista CASCADE;
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
DROP TABLE IF EXISTS notificacao CASCADE;

CREATE TABLE usuario (
  id            BIGINT,
  nome_completo TEXT    NOT NULL,
  email         TEXT    NOT NULL,
  senha         TEXT    NOT NULL,

  CONSTRAINT usuario_pk PRIMARY KEY (id)
);

CREATE TABLE administrador (
    usuario_id    BIGINT NOT NULL,

    CONSTRAINT admin_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id),
    CONSTRAINT admin_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE laborista (
    usuario_id            BIGINT NOT NULL,
    numero_identificacao  BIGINT,

    CONSTRAINT laborista_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id),
    CONSTRAINT laborista_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE cliente (
    usuario_id  BIGINT NOT NULL,
    telefone    VARCHAR(20),

    CONSTRAINT cliente_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id),
    CONSTRAINT cliente_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE medico (
    usuario_id    BIGINT NOT NULL,
    registro_crm  BIGINT,

    CONSTRAINT medico_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id),
    CONSTRAINT medico_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE notificacao (
    id          BIGINT,
    usuario_id  BIGINT    NOT NULL,
    data        TIMESTAMP NOT NULL,
    visualizado BOOL      DEFAULT false,
    texto       TEXT      NOT NULL,

    CONSTRAINT notificacao_usuario_fk FOREIGN KEY (usuario_id)
      REFERENCES usuario (id),
    CONSTRAINT notificacao_pk PRIMARY KEY (id)
);

CREATE TABLE tipo_painel (
    id        BIGINT,
    descricao TEXT,

    CONSTRAINT tipo_painel_pk PRIMARY KEY (id)
);

CREATE TABLE coleta (
    id              BIGINT,
    cliente_id      BIGINT    NOT NULL,
    tipo_painel_id  BIGINT    NOT NULL,
    data            TIMESTAMP NOT NULL,

    CONSTRAINT coleta_cliente_fk FOREIGN KEY (cliente_id)
      REFERENCES cliente (usuario_id),
    CONSTRAINT coleta_tipo_painel_fk FOREIGN KEY (tipo_painel_id)
      REFERENCES tipo_painel (id),
    CONSTRAINT coleta_pk PRIMARY KEY (id)
);


CREATE TABLE exame (
    id              BIGINT,
    coleta_id       BIGINT    NOT NULL,
    tempo_estimado  INTERVAL  NOT NULL,

    CONSTRAINT exame_coleta_fk FOREIGN KEY (coleta_id)
      REFERENCES coleta (id),
    CONSTRAINT exame_pk PRIMARY KEY (id)
);

CREATE TYPE TIPO_DE_ESTADO_DO_EXAME
  AS ENUM('na fila', 'processando', 'completo', 'inválido', 'autorizado', 'cancelado');

CREATE TABLE andamento_exame (
  usuario_id      BIGINT,
  exame_id        BIGINT,
  data            TIMESTAMP               NOT NULL,
  estado_do_exame TIPO_DE_ESTADO_DO_EXAME NOT NULL,

  CONSTRAINT andamento_exame_usuario_fk FOREIGN KEY (usuario_id)
    REFERENCES usuario (id),
  CONSTRAINT andamento_exame_exame_fk FOREIGN KEY (exame_id)
    REFERENCES exame (id),
  CONSTRAINT andamento_exame_pk PRIMARY KEY (usuario_id, exame_id)
);

CREATE TABLE painel (
    exame_id                      BIGINT,
    tipo_painel_id                BIGINT,
    sequencia_de_codigo_genetico  TEXT    NOT NULL,

    CONSTRAINT painel_exame_fk FOREIGN KEY (exame_id)
      REFERENCES exame (id),
    CONSTRAINT painel_tipo_painel_fk FOREIGN KEY (tipo_painel_id)
      REFERENCES tipo_painel (id),
    CONSTRAINT painel_pk PRIMARY KEY (exame_id, tipo_painel_id)
);

CREATE TABLE condicao (
    id              BIGINT,
    descricao       TEXT    NOT NULL,
    nome            TEXT    NOT NULL,
    prob_populacao  FLOAT   NOT NULL,

    CONSTRAINT condicao_pk PRIMARY KEY (id)
);

CREATE TABLE condicao_sequencia_dna (
    condicao_id         BIGINT,
    sequencia_dna       TEXT,
    prob_seq            FLOAT   NOT NULL,
    prob_seq_dado_cond  FLOAT   NOT NULL,

    CONSTRAINT condicao_sequencia_dna_condicao_fk FOREIGN KEY (condicao_id)
      REFERENCES condicao (id),
    CONSTRAINT condicao_sequencia_dna_pk PRIMARY KEY (condicao_id, sequencia_dna)
);

CREATE TABLE identifica_condicao (
    exame_id        BIGINT,
    tipo_painel_id  BIGINT,
    condicao_id     BIGINT,

    CONSTRAINT identifica_condicao_painel_fk FOREIGN KEY (exame_id, tipo_painel_id)
      REFERENCES painel (exame_id, tipo_painel_id),
    CONSTRAINT identifica_condicao_condicao_fk FOREIGN KEY (condicao_id)
      REFERENCES condicao (id),
    CONSTRAINT identifica_conexao_pk PRIMARY KEY (exame_id, tipo_painel_id, condicao_id)
);
