# Apresentação

## Apresentação das BDS

Falar um pouco sobre como as bds foram utilizadas

## Geração de mundo (Max)

Falar um pouco sobre a geração aleatória de condições

## Apresentar uma interface CLI para os bancos de dados

Logar com 3 terminais diferentes

----------------------------------------------------------------------------------

[CLI] > Entre o seu email: john.doe@exemplo.com
[CLI] > Entre a sua senha: password

----------------------------------------------------------------------------------

[LAB] > Entre o seu email: alice.johnson@exemplo.com
[LAB] > Entre a sua senha: qwerty

----------------------------------------------------------------------------------

[MED] > Entre o seu email: sarah.thompson@exemplo.com
[MED] > Entre a sua senha: password456

----------------------------------------------------------------------------------

[LAB] > ajuda

    mostrar todos os comandos. Permissoes. (idealmente so as que o usuario tem)

[LAB] > adicionar-condicao <nome-da-condicao>

[CLI] > registrar-coleta <id-do-usuario>

    equivalente a mandar a coleta por sedex
    => retorna o id da coleta

[CLI] > listar-tipos-de-painel

    (1, 'Sequenciamento de Exoma Completo (WES)'),
        - Cancer
        - ...
    (2, 'Sequenciamento de Genoma Completo (WGS)'),
        - 'bromidrose plantar'
        - ...
    ...

[CLI] > pedir-exame <id-da-coleta> <id-do-tipo-do-panel>

    Você pediu um exame com sucesso.
    ID do exame: 3
    Tempo estimado: 3 dias

----------------------------------------------------------------------------------

[LAB] > pendencias

    Existem <n> exames pendentes:

    [id-do-exame] [id-do-usuario]
    [id-do-exame] [id-do-usuario]
    ...

[LAB] > fazer-exame <id-do-exame> <nome-da-pessoa-world>

    Exame realizado.


----------------------------------------------------------------------------------

[MED] > pendencias

    Existem <n> exames a serem validados.

    [id-do-exame] [id-do-usuario]
    [id-do-exame] [id-do-usuario]
    ...

[MED] > verificar-exame <id-do-exame>

    O Exame identificou as seguintes condicoes:

    Bromidrose plantar: 0.5
    Câncer de pulmão: 0.1

    => 1/2 (agendar consulta) | (enviar diretamente)

    => Escolher o (1)

----------------------------------------------------------------------------------

[CLI] > notificacoes

    [data] Você tem uma consulta agendada

[CLI] > mostrar-arvore

    [pai] Vasily
    [mae] Ekaterina

[CLI] > mostrar-condicoes

    Bromidrose plantar: 0.5
    Câncer de pulmão: 0.1


# Realizar 3 exames A: (CHL3) (completo) B: (completo)

    Para duas pessoas A e B
