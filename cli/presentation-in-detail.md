Apresentação: 

Começar a execução do sistema:

> ./start.sh

Checar a execucação do sistema:

> ./checkhealth

# Laboratorista

> python3 cli/main.py

Presionar a opção de login [1] e digitar o email
e senha do laboratorista.

email: lab
senha: lab

Mudar o prompt para LAB

> mudar-prompt LAB

Listar as condicoes existentes no sistema:

> listar-condicoes

Adicionar uma condicao nova no sistema:

> adicionar-condicao bromidase-plantar 

cheiro forte na base do pe
chule
listar-condicoes
listar-tipos-de-painel
registrar-tipo-de-painel 'CHL3' 5
listar-tipos-de-painel
# cliente
python3 main.py
cli
cli
mudar-prompt cli
registrar-coleta 1
# lab
pendencias
# cliente
pedir-exame 6 13
notificacoes
notificacoes
# lab
pendencias
fazer-exame 4 john
pendencias
# cliente
notificacoes
# lab
sair
# med
python3 main.py
med
med
mudar-prompt MED
pendencias
validar-exame 4
pendencias
sair
# cli
mostrar-condicoes-identificadas
sair
## parte 2
curl localhost:4000/neo4j/listFamily/8
# pai
python3 main.py
pai
pai
mudar-prompt PAI
mostrar-arvore 8
registrar-coleta 8
pedir-exame 7 1 # retornado por registrar coleta
# filha
python3 main.py
filha
filha
mudar-prompt FILHA
registrar-coleta 9
pedir-exame 8 1
sair
# lab
python3 main.py
lab
lab
mudar-prompt LAB
pendencias
fazer-exame 5 joao
fazer-exame 6 joana
sair
# pai
mostrar-arvore 8
