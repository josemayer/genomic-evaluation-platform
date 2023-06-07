INSERT INTO usuario (id, nome_completo, email, senha)
VALUES
  (1, 'John Doe', 'john.doe@exemplo.com', 'password'),
  (2, 'Jane Smith', 'jane.smith@exemplo.com', 'password123'),
  (3, 'Alice Johnson', 'alice.johnson@exemplo.com', 'qwerty'),
  (4, 'Bob Anderson', 'bob.anderson@exemplo.com', 'abcdef'),
  (5, 'Emily Davis', 'emily.davis@exemplo.com', '123456'),
  (6, 'Michael Wilson', 'michael.wilson@exemplo.com', 'abc123'),
  (7, 'Sarah Thompson', 'sarah.thompson@exemplo.com', 'password456'),
  (8, 'David Rodriguez', 'david.rodriguez@exemplo.com', 'p@$$w0rd'),
  (9, 'Olivia Martinez', 'olivia.martinez@exemplo.com', 'test123'),
  (10, 'James Taylor', 'james.taylor@exemplo.com', 'letmein');

INSERT INTO administrador (usuario_id)
VALUES
  (10);

INSERT INTO laborista (usuario_id, numero_identificacao)
VALUES
  (3, 123456789),
  (4, 987654321);

INSERT INTO cliente (usuario_id, telefone)
VALUES
  (1, '(12) 23456-7890'),
  (2, '(11) 99654-3210'),
  (5, '(67) 99999-9999'),
  (6, '(11) 91222-3333'),
  (8, '(41) 97777-7777'),
  (9, '(21) 98444-5555');

INSERT INTO medico (usuario_id, registro_crm)
VALUES
  (7, 234567);

INSERT INTO notificacao (id, usuario_id, data, visualizado, texto)
VALUES
  (1, 1, '2023-06-07 08:12:33', false, 'Sua coleta foi registrada com sucesso!'),
  (2, 2, '2023-06-07 08:12:33', false, 'Sua coleta foi registrada com sucesso!'),
  (3, 3, '2023-06-13 10:21:55', true, 'Você possui 3 novas coletas para dar andamento!'),
  (4, 4, '2023-06-13 14:57:38', true, 'Você possui 2 novas coletas para dar andamento!'),
  (5, 5, '2023-06-07 16:39:13', false, 'Identificamos um novo membro em sua árvore genealógica! Confira em sua aba de genealogia!'),
  (6, 6, '2023-06-09 13:21:49', false, 'Sua coleta foi registrada com sucesso!'),
  (7, 7, '2023-06-14 09:20:05', true, 'O sistema classificou um mapeamento completo de predisposições para um exame. Verifique essa informação em sua aba de pendências.'),
  (8, 8, '2023-06-10 15:23:42', true, 'Devido a um erro na coleta, o seu exame registrado em 10/06/2023 às 12:02 foi cancelado. Por favor, entre em contato conosco para realizar uma nova coleta.'),
  (9, 9, '2023-06-18 10:00:00', false, 'Sua lista completa de predisposições genéticas está disponível em sua aba de resultados.'),
  (10, 1, '2023-06-13 02:56:45', false, 'O seu exame foi registrado e será processado por um laboratorista em breve!'),
  (11, 9, '2023-06-01 02:01:10', false, 'Sua coleta foi registrada com sucesso!'),
  (12, 8, '2023-06-10 09:10:12', false, 'Sua coleta foi registrada com sucesso!'),
  (13, 8, '2023-06-10 12:02:00', false, 'O seu exame foi registrado e será processado por um laboratorista em breve!');

INSERT INTO tipo_painel (id, descricao)
VALUES
  (1, 'Sequenciamento de Exoma Completo (WES)'),
  (2, 'Sequenciamento de Genoma Completo (WGS)'),
  (3, 'Gene BRCA1'),
  (4, 'Gene BRCA2'),
  (5, 'Gene TP53'),
  (6, 'Gene PTEN'),
  (7, 'Gene APC'),
  (8, 'Gene MLH1'),
  (9, 'Gene MSH2'),
  (10, 'Gene MSH6'),
  (11, 'Farmacogenético'),
  (12, 'Pré-natal');

INSERT INTO coleta (id, cliente_id, tipo_painel_id, data)
VALUES
  (1, 1, 1, '2023-06-07 08:12:33'),
  (2, 2, 1, '2023-06-07 08:12:33'),
  (3, 6, 3, '2023-06-09 13:21:49'),
  (4, 8, 9, '2023-06-10 09:10:12'),
  (5, 9, 2, '2023-06-01 14:01:10');

INSERT INTO exame (id, coleta_id, tempo_estimado)
VALUES
  (1, 1, INTERVAL '15 days'),
  (2, 5, INTERVAL '15 days'),
  (3, 4, INTERVAL '6 days');

INSERT INTO andamento_exame (usuario_id, exame_id, data, estado_do_exame)
VALUES
  (3, 1, '2023-06-13 14:56:45', 'na fila'),
  (3, 1, '2023-06-14 09:32:00', 'processando'),
  (7, 2, '2023-06-18 10:00:00', 'completo'),
  (4, 3, '2023-06-10 12:02:00', 'na fila'),
  (4, 3, '2023-06-10 15:23:42', 'inválido');

INSERT INTO painel (exame_id, tipo_painel_id, sequencia_de_codigo_genetico)
VALUES
  (1, 1, 'AGCTGCTAGCGTACGTATGCGTATCGTGCATGCTA'),
  (2, 2, 'GCTAGCTAGTACGTCATCAGCGTACAGTGATCGCA');

INSERT INTO condicao (id, descricao, nome, prob_populacao)
VALUES
  (1, 'Doença caracterizada pela fragilidade e perda da densidade óssea, tornando os ossos mais suscetíveis a fraturas', 'Osteoporose', 0.1),
  (2, 'Doença crônica caracterizada pelo crescimento descontrolado de células malignas nos tecidos mamários', 'Câncer de Mama', 0.12),
  (3, 'Doença crônica genética caracterizada pela produção de muco espesso e pegajoso. Esse muco é capaz de bloquear as vias aéreas.', 'Fibrose cística', 0.00034);

INSERT INTO condicao_sequencia_dna (condicao_id, sequencia_dna, prob_seq, prob_seq_dado_cond)
VALUES
  (1, 'AGCTGCTAG', 0.1, 0.9),
  (1, 'GCTAGCTAG', 0.2, 0.8),
  (1, 'CTAGCTAGC', 0.3, 0.7),
  (2, 'TAGCTAGCT', 0.4, 0.6),
  (2, 'AGCTAGCTA', 0.5, 0.5),
  (3, 'GCTAGCTAG', 0.02, 0.3);

INSERT INTO identifica_condicao (exame_id, tipo_painel_id, condicao_id)
VALUES
  (2, 2, 1),
  (2, 2, 3);
