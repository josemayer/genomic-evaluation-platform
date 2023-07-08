# returns a token
def login(email, password):
    if email == "lua.til" and password == "123":
        # => Enviar o email e senha para o servidor
        # <= Receber o token do servidor
        print("Login bem sucedido")
        return hash(email+password)
    elif email == "lua.til" and password != "123":
        print("Senha incorreta")
        return False
    else:
        print("Login incorreto")
        return False

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

    res = summary + '\nCONDICOES\n' + "\n".join([": ".join(cond) for cond in conditions]) + "\nRELACOES\n" + "\n".join([": ".join(rel) for rel in relations])
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

    res = summary + '\nCONDICOES\n' + "\n".join([": ".join(cond) for cond in conditions]) + "\nRELACOES\n" + "\n".join([": ".join(rel) for rel in relations])
    print(res)


def main():

    logged = False
    tok = None

    while not logged:
        email = input("Entre o seu email: ")
        password = input("Entre a sua senha: ")

        tok = login(email, password)

        if tok != False:
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



if __name__=="__main__":
    main()
