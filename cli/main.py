import http.client
import json
import os
import subprocess

ADDRESS = "localhost"
PORT = 4000

GENERATOR_PATH = "./../world-generator/"
GENERATOR = "./generator"

global_token = ""


def show_tree(family_id):
    res = make_get_request_with_token('/neo4j/listFamily/' + family_id)
    print(res)


def add_condition(condition_name):
    condition_description = input("Digite a descricao da condicao: ")
    world_name = input("Digite o nome no mundo: ")

    data = subprocess.check_output([GENERATOR, "read_condition", world_name])
    data = data.decode('utf-8')
    data = data.split('\n')

    linenum, prob = data[0].split(' ')
    lines = [el.split(' ') for el in data[1:] if len(el) > 1]
    genetic_information = [{"sequence": el[0], "probabilityInPopulation": el[1], "probabilityGivenSequence": el[2]} for el in lines]

    payload = {
        "description": condition_description,
        "condition_name": condition_name,
        "prob_pop": prob,
        "genetic_information": genetic_information
    }

    req = make_post_request_with_token('/conditions/add', payload)

    if "message" in req:
        print(req)
        return None

    print_string = f"""
        Adicionando a nova condicao.
    """

    print(print_string)


def get_token(mail, password):
    conn = http.client.HTTPConnection(ADDRESS, PORT)
    payload = json.dumps({
        "mail": mail,
        "password": password
    })
    headers = {
        'Content-Type': 'application/json'
    }
    conn.request("POST", "/users/login", payload, headers)
    res = conn.getresponse()
    data = res.read()
    data = data.decode("utf-8")
    data = json.loads(data)
    if "token" not in data:
        return False
    return data['token']


def make_post_request_with_token(url, payload):
    global global_token

    if global_token == "":
        return None

    bearer_token = 'Bearer ' + global_token

    conn = http.client.HTTPConnection(ADDRESS, PORT)
    payload = json.dumps(payload)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': bearer_token
    }
    conn.request("POST", url, payload, headers)
    res = conn.getresponse()
    data = res.read()
    data = data.decode("utf-8")
    data = json.loads(data)
    return data


def make_get_request_with_token(url):
    global global_token

    if global_token == "":
        return None

    bearer_token = 'Bearer ' + global_token

    conn = http.client.HTTPConnection(ADDRESS, PORT)
    headers = {
        'Authorization': bearer_token
    }
    conn.request("GET", url, '', headers)
    res = conn.getresponse()
    data = res.read()
    data = data.decode("utf-8")
    data = json.loads(data)
    return data


# returns a token
def login(email, password):
    global global_token

    token_or_false = get_token(email, password)

    if not token_or_false:
        print("Senha incorreta")
        return False

    print("Login bem sucedido")
    global_token = token_or_false
    # print(token_or_false)
    return True


def notifications():
    notifications_internal = make_get_request_with_token('/notifications')
    for notification in filter(lambda x: not x['visualizado'], notifications_internal):
        print(f"{notification['data']} {notification['texto']}")

def todos():
    notifications_internal = make_get_request_with_token('/notifications/todos')
    if len(notifications_internal) == 0:
        print("Nenhuma pendencia")
        return
    for notification in notifications_internal:
        print(notification)


def validate_exam(exam_id):
    make_post_request_with_token('/exams/step/validate', {'exam_id': exam_id})
    print(f"""
        O exame foi validado
    """)

def do_exam(exam_id, world_name):

    req = make_get_request_with_token(f"/exams/identify/{exam_id}")

    if "message" in req:
        print(req)
        return None

    conditions_to_find = req['conditions_to_find']

    for i in range(len(req['conditions_to_find'])):
        conditions_to_find[i] = input(f"Qual e o nome de {conditions_to_find[i]} no mundo?")

    data = subprocess.check_output([GENERATOR, "new_panel", world_name] + conditions_to_find)
    data = data.decode('utf-8')
    data = data.split('\n')

    req = make_post_request_with_token('/exams/step/process', {'exam_id': exam_id, "genes": data})

    if "message" in req:
        print(req)
        return None

    print_string = f"""
        O exame foi realizado.
    """

    print(print_string)


def register_sample(user_id):
    req = make_post_request_with_token('/samples/new', {'user_id': user_id})

    if "sample" not in req:
        print("Erro ao registrar coleta:")
        print(req["message"])
        return None

    coleta_id = req['sample']['id']

    print_string = f"""
        Coleta registrada com sucesso!
        Id da coleta: {coleta_id}
    """

    print(print_string)



def view_samples():
    req = make_get_request_with_token('/samples')

    if "userSamples" not in req:
        print("Erro ao listar coletas:")
        print(req["message"])
        return None

    print("Coletas:")
    for sample in req["userSamples"]:
        print(json.dumps(sample, indent=4, sort_keys=True))


def ask_for_exam(sample_id, panel_type_id):
    req = make_post_request_with_token('/exams/step/enqueue', {'sample_id': sample_id, 'panel_type_id': panel_type_id})

    # TODO(luatil): Handle req failure
    exam_id = req['step_result']['exam_id']
    estimated_time_days = req['step_result']['estimated_time']['days']

    print_string = f"""
        Você pediu um exame com sucesso.
        ID do exame: {exam_id}
        Tempo estimado: {estimated_time_days} dias
    """

    print(print_string)

def show_conditions():
    req = make_get_request_with_token('/conditions/list')
    for cond in req:
        print(f"{cond['id']} {cond['nome']}")

def show_user_conditions():
  req = make_get_request_with_token('/exams/user/completed')

  if not "exams" in req:
    print("Erro ao listar exames:")
    print(req["message"])
    return None

  for exam in req["exams"]:
    print(f"Exame {exam['id']}:")
    for cond in exam['conditions']:
      print(f"  - {cond['nome']}: {cond['probabilidade']}")
  print('')

def register_panel_type_with_conditions(panel_type_desc, conditions):
  req = make_post_request_with_token('/panels/types/new', {'description': panel_type_desc, 'conditions_id_list': conditions})

  if not "panel" in req:
    print("Erro ao registrar painel:")
    print(req["message"])
    return None

  print("Painel registrado com sucesso!")
  # print(req["panel"])

def list_panel_types():
    req = make_get_request_with_token('/panels/types/list')
    for pt in req:
        print(f"{pt['id']} {pt['descricao']}")
        for c in pt['conditions']:
            print(f"  - {c['condicao_id']} {c['nome']}")

def main():
    logged = False

    while not logged:
        email = input("Entre o seu email: ")
        password = input("Entre a sua senha: ")

        #  email = "john.doe@exemplo.com"
        #  password = "password"

        # email = "alice.johnson@exemplo.com"
        # password = "qwerty"

        if login(email, password):
            logged = True

    os.chdir(GENERATOR_PATH)

    PROMPT = ""

    while True:
        line = input(f"[{PROMPT}] > ")
        tokens = line.split(" ")
        if tokens[0] == "sair":
            print("Saindo...")
            break
        elif tokens[0] == "mudar-prompt":
            if len(tokens) != 2:
                print("Comando invalido: mudar-prompt <novo_prompt>")
                continue
            PROMPT = tokens[1]
        elif tokens[0] == "ls":
            print(os.getcwd())
        elif tokens[0] == "notificacoes":
            notifications()
        elif tokens[0] == "pendencias":
            todos()
        elif tokens[0] == "pedir-exame":
            if len(tokens) != 3:
                print("Comando invalido: pedir-exame <id_amostra> <id_painel>")
                continue
            sample_id = tokens[1]
            panel_type_id = tokens[2]
            ask_for_exam(sample_id, panel_type_id)
        elif tokens[0] == "fazer-exame":
            if len(tokens) != 3:
                print("Comando invalido: fazer-exame <id_exame> <noma_da_pessoa_world>")
                continue
            exam_id = tokens[1]
            world_name = tokens[2]
            do_exam(exam_id, world_name)
        elif tokens[0] == "validar-exame":
            if len(tokens) != 2:
                print("Comando invalido: validar-exame <id-do-exame>")
                continue
            exam_id = tokens[1]
            validate_exam(exam_id)
        elif tokens[0] == "registrar-coleta":
            if len(tokens) != 2:
                print("Comando invalido: registrar-coleta <id_usuario>")
                continue
            user_id = tokens[1]
            register_sample(user_id)
        elif tokens[0] == "ver-coletas":
            if len(tokens) != 1:
                print("Comando invalido: ver-coletas não possui argumentos")
                continue
            view_samples()
        elif tokens[0] == "registrar-tipo-de-painel":
            if len(tokens) < 3:
                print("Comando invalido: registrar-tipo-de-painel '<descricao>' <id_condicao> ... <id_condicao>")
                continue

            panel_type_desc = " ".join(tokens[1:]).split("'")[1::2][0]
            conditions = [int(x) for x in " ".join(tokens[1:]).split("'")[2::2][0].split(" ") if x != ""]

            register_panel_type_with_conditions(panel_type_desc, conditions)
        elif tokens[0] == "adicionar-condicao":
            if len(tokens) != 2:
                print("Comand invalido: adicionar-condicao <nome-condicao>")
                continue
            condition_name = tokens[1]
            add_condition(condition_name)
        elif tokens[0] == "listar-condicoes":
            show_conditions()
        elif tokens[0] == "mostrar-condicoes-identificadas":
            show_user_conditions()
        elif tokens[0] == "listar-tipos-de-painel":
            list_panel_types()
        elif tokens[0] == "mostrar-arvore":
            if len(tokens) != 2:
                print("Comando invalido: mostrar-arvore <id de membro familia>")
                continue
            show_tree(tokens[1])
        else:
            print("Comando invalido")


if __name__ == "__main__":
    main()
