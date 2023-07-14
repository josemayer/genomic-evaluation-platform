import http.client
import json
import os
import subprocess

ADDRESS = "localhost"
PORT = 4000

GENERATOR_PATH = "./world-generator/"
GENERATOR = "./generator"

global_token = ""


def help():
    print("""
        Comandos disponíveis:
        - sair: Encerra o programa.
        - mudar-prompt <novo_prompt>: Altera o prompt atual para o novo_prompt.
        - ls: Exibe o diretório atual.
        - notificacoes: Exibe as notificações do usuário.
        - pendencias: Exibe as pendências do usuário.
        - pedir-exame <id_amostra> <id_painel>: Solicita a realização de um exame para uma amostra específica, usando um determinado tipo de painel.
        - fazer-exame <id_exame> <nome_da_pessoa_world>: Realiza um exame específico para uma pessoa, utilizando um mundo com o nome fornecido.
        - validar-exame <id_do_exame>: Valida um exame realizado, utilizando o ID do exame.
        - registrar-coleta <id_usuario>: Registra uma nova coleta de amostra para um usuário específico.
        - ver-coletas: Exibe as coletas de amostras realizadas.
        - registrar-tipo-de-painel '<descricao>' <id_condicao> ... <id_condicao>: Registra um novo tipo de painel, com uma descrição e uma lista de IDs de condições associadas.
        - adicionar-condicao <nome_condicao>: Adiciona uma nova condição, com nome, descrição e informações genéticas.
        - listar-condicoes: Lista todas as condições registradas.
        - mostrar-condicoes-identificadas: Exibe as condições identificadas nos exames realizados pelo usuário.
        - listar-tipos-de-painel: Lista todos os tipos de painel registrados.
        - mostrar-arvore <id_de_membro_familia>: Exibe a árvore genealógica de um membro da família com o ID fornecido.
    """)


def show_tree(family_id):
    res = make_get_request_with_token('/neo4j/listFamily/' + family_id)
    print(res)


def add_condition(condition_name):
    condition_description = input("Digite a descricao da condicao: ")
    world_name = input("Digite o nome no mundo: ")

    error_string = """
      Condicao nao existe no mundo gerado. Para adicionar nova condicao é necessário gerar ela no mundo.
    """

    if not os.path.exists(world_name):
        print(error_string)
        # Print all file names in the directory
        print("Condicoes disponíveis: ")
        for file in os.listdir('world/conditions'):
            print(file)
        return None

    data = subprocess.check_output([GENERATOR, "read_condition", world_name])
    data = data.decode('utf-8')
    data = data.split('\n')

    linenum, prob = data[0].split(' ')
    lines = [el.split(' ') for el in data[1:] if len(el) > 1]
    genetic_information = [{"sequence": el[0], "probabilityInPopulation": el[1],
                            "probabilityGivenSequence": el[2]} for el in lines]

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
    try:
        conn.request("POST", "/users/login", payload, headers)
    except ConnectionRefusedError:
        print("Conexão recusada com o servidor")
        exit(1)
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
    try:
        conn.request("POST", url, payload, headers)
    except ConnectionRefusedError:
        print("Conexão recusada com o servidor")
        exit(1)
    res = conn.getresponse()
    data = res.read()
    data = data.decode("utf-8")
    data = json.loads(data)
    return data


def make_post_request_without_token(url, body):
    conn = http.client.HTTPConnection(ADDRESS, PORT)
    payload = json.dumps(body)
    headers = {
        'Content-Type': 'application/json'
    }
    try:
        conn.request("POST", url, payload, headers)
    except ConnectionRefusedError:
        print("Conexão recusada com o servidor")
        exit(1)
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


def register_client(nome_completo, email, senha, telefone):
    new_client = make_post_request_without_token(
        '/users/client/new', {'nome_completo': nome_completo, 'email': email, 'senha': senha, 'telefone': telefone})

    if not "client" in new_client:
        print("Erro ao cadastrar cliente:")
        print(new_client)
        return -1

    print("Cliente cadastrado com sucesso:")
    print(new_client['client'])
    return new_client['client']['id']


def notifications():
    notifications_internal = make_get_request_with_token('/notifications')
    for notification in filter(lambda x: not x['visualizado'], notifications_internal):
        print(f"{notification['data']} {notification['texto']}")


def todos():
    notifications_internal = make_get_request_with_token(
        '/notifications/todos')
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
        conditions_to_find[i] = input(
            f"Qual e o nome de {conditions_to_find[i]} no mundo: ")

    data = subprocess.check_output(
        [GENERATOR, "new_panel", world_name] + conditions_to_find)
    data = data.decode('utf-8')
    data = data.split('\n')

    req = make_post_request_with_token(
        '/exams/step/process', {'exam_id': exam_id, "genes": data})

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
    req = make_post_request_with_token(
        '/exams/step/enqueue', {'sample_id': sample_id, 'panel_type_id': panel_type_id})

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
    req = make_post_request_with_token(
        '/panels/types/new', {'description': panel_type_desc, 'conditions_id_list': conditions})

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
    exit_program = False

    try:
        os.chdir(GENERATOR_PATH)
    except FileNotFoundError:
        print("Gerador não encontrado")
        exit(1)

    print(f"Bem vindo(a) à Plataforma Genômica Personalizada!")

    while not exit_program:
        while not logged:
            print("\nSelecione uma opção para continuar:")

            option = input(f"[1] Login\n[2] Registrar\n[3] Sair\n")

            if option == "1":
                email = input("Insira o seu email: ")
                password = input("Insira a sua senha: ")

                if login(email, password):
                    logged = True

            elif option == "2":
                nome = input("Qual é o seu nome completo? ")
                email = input("Qual é o seu email? ")
                password = input("Qual é a sua senha? ")
                telefone = input("Qual é o seu telefone? ")

                register_client(nome, email, password, telefone)
            elif option == "3":
                print("Saindo...")
                exit_program = True
                break
            else:
                print("Opção inválida")

        PROMPT = ""

        while not exit_program and logged:
            line = input(f"[{PROMPT}] > ")
            tokens = line.split(" ")
            if tokens[0] == "sair":
                print("Saindo...")
                logged = False
            elif tokens[0] == "ajuda":
                help()
                continue
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
                    print(
                        "Comando invalido: fazer-exame <id_exame> <noma_da_pessoa_world>")
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
                    print(
                        "Comando invalido: registrar-tipo-de-painel '<descricao>' <id_condicao> ... <id_condicao>")
                    continue

                panel_type_desc = " ".join(tokens[1:]).split("'")[1::2][0]
                conditions = [int(x) for x in " ".join(tokens[1:]).split("'")[
                    2::2][0].split(" ") if x != ""]

                register_panel_type_with_conditions(
                    panel_type_desc, conditions)
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
