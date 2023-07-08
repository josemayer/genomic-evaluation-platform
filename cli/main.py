import http.client
import json

global_token = None


def get_token(mail, password):
    conn = http.client.HTTPConnection("localhost", 4000)
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


def do_exam(exam_id):
    print("Fazendo o exame {}".format(exam_id))
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


def main():
    logged = False

    while not logged:
        email = input("Entre o seu email: ")
        password = input("Entre a sua senha: ")

        if login(email, password):
            logged = True

    while True:
        line = input("> ")
        tokens = line.split(" ")
        if tokens[0] == "sair":
            print("Saindo...")
            break
        elif tokens[0] == "notificacoes":
            notifications()
        elif tokens[0] == "fazer-exame":
            if len(tokens) != 2:
                print("Comando invalido")
                continue
            exam_id = tokens[1]
            do_exam(exam_id)
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
