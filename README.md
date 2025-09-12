# Projeto Gestão de Pacientes

## Descrição do Projeto
Projeto **em desenvolvimento** para a matéria *Software Product: Analysis, Specification, Project & Implementation*, do curso de Análise e Desenvolvimento de Sistemas da faculdade Impacta.

O projeto foi desenvolvido com base na minha área de atuação, a *Biomedicina*. Ele surgiu da necessidade de melhorar a usabilidade dos programas utilizados nesse campo. A aplicação tem como objetivo oferecer ao profissional uma forma intuitiva e agradável de utilizar para gerenciar os pacientes e seus exames laboratoriais.

Com ela, é possível visualizar pacientes, acessar seus exames, além de adicionar ou remover registros de maneira simples e prática.


## 📌 Status do Projeto

**Em desenvolvimento** 🚧  

### 🔧 Próximas Funcionalidades

- [X] **AC 1** – Cadastrar um novo paciente  
- [ ] **AC 2** – Exibir todos os pacientes cadastrados e permitir a busca por ID e CPF 
- [ ] **AC 3** – Editar os dados de um paciente existente  
- [ ] **AC 4** – Excluir um paciente do banco de dados  
- [ ] **Futuro** – Integrar os arquivos de exames de cada paciente, permitindo:  
  - Visualização dos laudos em tela  
  - Impressão dos laudos mediante solicitação do paciente  


## 🛠 Tecnologias Utilizadas

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Estrutura do Banco de Dados

gestao_pacientes
    pacientes {
        SERIAL id PK "ID Único do Paciente"
        VARCHAR(255) nome_completo NOT_NULL
        VARCHAR(20) celular
        VARCHAR(11) cpf UNIQUE NOT_NULL
        VARCHAR(255) email UNIQUE
    }
    exames {
        SERIAL id PK "ID Único do Exame"
        VARCHAR(100) nome_exame NOT_NULL
        TEXT descricao
    }
    paciente_exames {
        SERIAL id PK "ID Único da Associação"
        INT paciente_id FK "Referencia pacientes.id"
        INT exame_id FK "Referencia exames.id"
        TIMESTAMPTZ data_registro "Data do registro do exame"
    }

    pacientes ||--o{ paciente_exames : "realiza"}
    exames ||--o{ paciente_exames : "é realizado por"}

## Instalação e Como Rodar o Projeto

- 

## Como Usar

## 👩‍💻 Autor

- **Anny Ayumi Iogi**  
  [![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/annyayumi)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/annyayumi/)
