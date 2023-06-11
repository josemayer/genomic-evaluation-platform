--- A query abaixo falha devido à nulidade do atributo password, que deve ser
--- não nulo de acordo com a restrição.
INSERT INTO usuario (nome_completo, email)
VALUES ('Johanne', 'johanne@exemplo.com');

--- A query abaixo falha devido à restrição de chave primária (não existe um
--- usuário com o id 2000 nas instâncias-exemplo)
INSERT INTO cliente (usuario_id, telefone)
VALUES (2000, '(11) 99966-1122');

--- A query abaixo falha devido à duplicidade do id de usuário (já existe um
--- usuário com o id 1 nas instâncias-exemplo).
INSERT INTO usuario (id, nome_completo, email, password)
VALUES (1, 'Johanne', 'johanne@exemplo.com', '654321');

--- A query abaixo remove o primeiro usuário e, por consequência, remove as
--- notificações associadas a ela, devido ao DELETE ON CASCADE.
SELECT * FROM notificacao WHERE usuario_id = 1;

DELETE FROM usuario WHERE id = 1;

SELECT * FROM notificacao WHERE usuario_id = 1;

--- A query abaixo insere um registro novo de histórico do exame de id 1,
--- mas com um valor diferente dos definidos. Isso causa falha de inserção
--- por conta da restrição do tipo TIPO_DE_ESTADO_DO_EXAME e da restrição
--- de checagem.
INSERT INTO andamento_exame (usuario_id, exame_id, data, estado_do_exame)
VALUES (1, 1, '2023-06-12 13:00:00', 'foo');
