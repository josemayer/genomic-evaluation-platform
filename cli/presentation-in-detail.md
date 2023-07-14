Apresentação: 

### Parte 1 (Detecao de condicoes)

Começar a execução do sistema:

> ./start.sh

Checar a execucação do sistema:

> ./checkhealth

# Laboratorista

Comecar a execucao como laboratorista

> python3 cli/main.py

Presionar a opção de login [1] e digitar o email
e senha do laboratorista.

email: lab
senha: lab

Lista todos os comandos disponíveis:

> ajuda

Mudar o prompt para LAB

> mudar-prompt LAB

Listar as condicoes existentes no sistema:

> listar-condicoes

Adicionar uma condicao nova no sistema:

> adicionar-condicao bromidase-plantar 
=> Cheiro forte no pe
=> chule

> listar-condicoes

Listar os tipos de painel disponiveis no sistema:

> listar-tipos-de-painel

Registrar um novo tipo de painel

> registrar-tipo-de-painel 'CHL3' 5
> listar-tipos-de-painel

# Cliente

Em outro terminal. Rodar o comando

> python3 cli/main.py

Logar com as credenciais

email: cli
senha: cli

Mudar o prompt para cliente

> mudar-prompt CLI 

Registrar uma coleta 

> registrar-coleta 1

Pedir um exame

> pedir-exame 6 13

# Laboratorista

Verificar pendencias

> pendencias

# Cliente

Checar as notificaoes com o cliente

> notificacoes
> notificacoes

# Laboratorista 

Checar as pendencias e realizar o exame 4

> pendencias
> fazer-exame 4 john
=> chule
> pendencias

# Cliente 

> notificacoes

# Laboratorista

Sair do usuario do laboratorista 

> sair

# Medico

[1] email: med senha: med

> mudar-prompt MED
> pendencias

Validar o exame 4

> validar-exame 4
> pendencias
> sair

# Cliente 

> mostrar-condicoes-identificadas
> sair

### Parte 2 (Deteccao de parentesco)

# Pai

Logar com as credencias email: pai e senha: pai

> mudar-prompt PAI

Mostrar a arvore genealogica do pai

> mostrar-arvore 8

Pedir exame como o pai

> registrar-coleta 8
> pedir-exame 7 1 # retornado por registrar coleta


# Filha  

Logar com as credencias email: filha e senha: filha 

> mudar-prompt FILHA
> registrar-coleta 9
> pedir-exame 8 1
> sair

# Laboratorista

Logar com as credencias email: lab e senha: lab 

> mudar-prompt LAB
> pendencias
> fazer-exame 5 joao
> fazer-exame 6 joana
> sair

# Pai 

Mostrar a arvore identificada para o Pai

> mostrar-arvore 8
