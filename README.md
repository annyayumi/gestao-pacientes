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


## 🛠️ Tecnologias Utilizadas

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## 🚀 Começando
Estas instruções permitirão que você obtenha uma cópia do projeto em operação em sua máquina local para fins de desenvolvimento e teste. Certifique-se de que: 

- Você instalou a versão mais recente de <Node.js, Git / cors, dotenv, express, pg, nodemon, mongoose>
- Você tem uma máquina <Windows / Linux / Mac>

### Como instalar o projeto

- No terminal (Git Bash, CMD, Power Shell), entre na pasta onde deseja clonar o projeto: <cd sistema-pacientes>
- Aplique o comando: <git clone https://github.com/annyayumi/gestao-pacientes.git>
- Instalar as dependências:
  - cd gestao-pacientes
  - cd backend
  - npm install
  - cd ..
  - cd frontend
  - npm install mongoose

### Configuração do Banco de Dados
Para rodar o backend desta aplicação, é necessário ter um banco de dados PostgreSQL configurado e populado com as tabelas corretas. Siga os passos abaixo.

  ### Pré-requisitos
  - **PostgreSQL:** Garanta que você tenha o PostgreSQL instalado na sua máquina. Se não tiver, você pode baixá-lo em [postgresql.org](https://www.postgresql.org/download/).
  - **Cliente SQL (Recomendado):[pgAdmin](https://www.pgadmin.org/) facilita a visualização e gerenciamento do banco de dados.

  ### Criação do Banco de Dados
  1.  Abra seu cliente SQL ou o terminal `psql`.
  2.  Execute o seguinte comando SQL para criar o banco. Você pode alterar o nome `gestao_pacientes` se desejar, mas lembre-se de atualizar o arquivo de configuração do backend (`.env` ou `db.js`) com o novo nome.

    ```sql
    CREATE DATABASE gestao_pacientes;
    ```
  
  Após criar e conectar-se ao banco `gestao_pacientes`, execute o script SQL abaixo para criar todas as tabelas necessárias com seus respectivos relacionamentos.

  ```sql
    -- Tabela para os dados dos pacientes
  CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    celular VARCHAR(20),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE
  );

  -- Tabela para o catálogo de exames disponíveis
  CREATE TABLE exames (
      id SERIAL PRIMARY KEY,
      nome_exame VARCHAR(100) NOT NULL,
      descricao TEXT
  );

  -- Tabela de associação para conectar pacientes e exames
  CREATE TABLE paciente_exames (
      id SERIAL PRIMARY KEY,
      paciente_id INTEGER NOT NULL,
      exame_id INTEGER NOT NULL,
      data_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Definição das chaves estrangeiras e suas regras
    CONSTRAINT fk_paciente
        FOREIGN KEY(paciente_id) 
        REFERENCES pacientes(id)
        ON DELETE CASCADE, -- Se um paciente for deletado, seus registros de exames também serão.

    CONSTRAINT fk_exame
        FOREIGN KEY(exame_id) 
        REFERENCES exames(id)
        ON DELETE RESTRICT -- Impede que um tipo de exame seja deletado se estiver em uso.
    );
  ```

  ### Configurar a conexão
  Por fim, o backend precisa saber como se conectar ao banco de dados que você acabou de criar.

    - Na pasta backend, procure por um arquivo chamado .env.example ou similar.
    - Crie uma cópia deste arquivo e renomeie-a para .env.
    - Abra o arquivo .env e preencha as variáveis de ambiente com suas credenciais do PostgreSQL.

### Como rodar o projeto
Abra 2 terminais:

  -Terminal 1: dentro da pasta frontend - npm start
  
  -Terminal 2: dentro da pasta backend - npm run dev

## 📫 Contribuindo para <gestao-pacientes>
Para contribuir com <gestao-pacientes>, siga estas etapas:

1. Bifurque este repositório.
2. Crie um ramo: git checkout -b <nome_branch>.
3. Faça suas alterações e confirme-as:git commit -m '<mensagem_commit>'
4. Envie para o branch original:git push origin <nome_do_projeto> / <local>
5. Solicite um pull request.

## 👩‍💻 Autor

- **Anny Ayumi Iogi**  
  [![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/annyayumi)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/annyayumi/)
