docker compose --profile dev build && docker compose --profile dev up
cd world-generator && make
# lab
python3 main.py
lab
lab
mudar-prompt LAB
listar-condicoes
adicionar-condicao bromidase-plantar 
cheiro forte na base do pe
chule
listar-condicoes
registrar-tipo-de-painel 'CHL3' 5
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
pedir-exame 7 1
# filha
python3 main.py
filha
filha
mudar-prompt FILHA
registrar-coleta 9
pedir-exame 8 1
# lab
python3 main.py
lab
lab
mudar-prompt LAB
pendencias
fazer-exame 5 joao
sair
# pai
mostrar-arvore 8
