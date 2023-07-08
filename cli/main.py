import http.client
import json
import os

ADDRESS = "localhost"
PORT = 4000

global_token = ""


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


# returns a token
def login(email, password):
    global global_token

    token_or_false = get_token(email, password)

    if not token_or_false:
        print("Senha incorreta")
        return False

    print("Login bem sucedido")
    global_token = token_or_false
    print(token_or_false)
    return True


def notifications():
    notifications = ["Voce tem que fazer o teste do joao", "Voce tem que fazer o teste do pedro"]
    for noti in notifications:
        print(noti)


def verifiy_exam(exam_id):
    print(f"Verificando o exame {exam_id}")
    summary = "Identifiquei:"

    conditions = [
        ["chule", "0.8"],
        ["asma", "0.1"],
        ["astigmatismo", "0.7"],
        ["cancer_de_pulmao", "0.001"]
    ]

    relations = [
        ["Pai", "Joao"],
        ["Mae", "Maria"],
        ["Filho", "Joao Vinicius"],
    ]

    res = summary + '\nCONDICOES\n' + "\n".join([": ".join(cond) for cond in conditions]) + "\nRELACOES\n" + "\n".join(
        [": ".join(rel) for rel in relations])
    print(res)
    answer = input("Y/N: ")

    while "Y" not in answer and "N" not in answer:
        answer = input("Y/N: ")

    if "Y" in answer:
        print("Enviando para o paciente")
    else:
        print("Exame rejeitado")


def do_exam(exam_id, file_name):

    if not os.path.exists(file_name):
        print("Arquivo não existe")
        return None

    data = None
    with open(file_name, 'r') as f:
        data = f.read()

    data = data.split('\n')

    req = make_post_request_with_token('/exams/step/process', {'exam_id': exam_id, "genes": data})

    if "message" in req:
        print(req)
        return None


    print_string = f"""
        Realizando o exame. 
    """

    print(print_string)


def ask_for_exam(sample_id):
    req = make_post_request_with_token('/exams/step/enqueue', {'sample_id': sample_id})

    # TODO(luatil): Handle req failure
    exam_id = req['step_result']['exam_id']
    estimated_time_days = req['step_result']['estimated_time']['days']

    print_string = f"""
        Você pediu um exame com sucesso.
        ID do exame: {exam_id}
        Tempo estimado: {estimated_time_days} dias
    """

    print(print_string)

    # print(f"Voc{sample_id}")
    # summary = "Identifiquei:"
    #
    # conditions = [
    #     ["chule", "0.8"],
    #     ["asma", "0.1"],
    #     ["astigmatismo", "0.7"],
    #     ["cancer_de_pulmao", "0.001"]
    # ]
    #
    # relations = [
    #     ["Pai", "Joao"],
    #     ["Mae", "Maria"],
    #     ["Filho", "Joao Vinicius"],
    # ]
    #
    # res = summary + '\nCONDICOES\n' + "\n".join([": ".join(cond) for cond in conditions]) + "\nRELACOES\n" + "\n".join(
    #     [": ".join(rel) for rel in relations])
    # print(res)


def main():
    logged = False

    while not logged:
        # email = input("Entre o seu email: ")
        # password = input("Entre a sua senha: ")


        # email = "john.doe@exemplo.com"
        # password = "password"

        email = "alice.johnson@exemplo.com"
        password = "qwerty"

        if login(email, password):
            logged = True

    while True:
        line = input("> ")
        tokens = line.split(" ")
        if tokens[0] == "sair":
            print("Saindo...")
            break
        elif tokens[0] == "ls":
            print(os.getcwd())
        elif tokens[0] == "notificacoes":
            notifications()
        elif tokens[0] == "pedir-exame":
            if len(tokens) != 2:
                print("Comando invalido: pedir-exame <id_amostra>")
                continue
            sample_id = tokens[1]
            ask_for_exam(sample_id)
        elif tokens[0] == "fazer-exame":
            if len(tokens) != 3:
                print("Comando invalido: fazer-exame <id_exame> <nome_do_arquivo>")
                continue
            exam_id = tokens[1]
            file_name = tokens[2]
            do_exam(exam_id, file_name=file_name)
        elif tokens[0] == "verificar-exame":
            if len(tokens) != 2:
                print("Comando invalido")
                continue
            exam_id = tokens[1]
            verifiy_exam(exam_id)
        else:
            print("Comando invalido")


if __name__ == "__main__":
    main()
