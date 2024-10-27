## Backend - Wefit
Teste de backend da Wefit.

### Pré-requisitos
Ter instalado e configurado o Docker e Node.

Para acessar qualquer rota da aplicação, é necessário incluir um token de autorização no cabeçalho da solicitação. Você pode configurar este token no arquivo .env usando a variável AUTH_TOKEN.

### Iniciando o banco de dados
Para iniciar o banco de dados MySQL, execute o seguinte comando na raiz do projeto:

```bash
docker-compose up -d
```

Isso criará um container MySQL que você poderá acessar via localhost:3306. Use o usuário root e a senha senha_root_123 para fazer login.

### Instalando as bibliotecas
```bash
npm install
```
### Iniciando o Servidor
Execute um dos seguintes comandos na raiz do projeto:
```bash
npm run start:dev
# ou
yarn start:dev
```

### Bibliotecas utilizadas
* cors: Middleware que permite requisições de origens diferentes.
* swagger: Ferramentas para gerar documentação Swagger para a API.
* typeorm: ORM (Object-Relational Mapping) para Node.js.
* mysql: Driver MySQL para Node.js.


### Utilizando as rotas
Para utilizar as rotas da API, você pode utilizar uma ferramenta como o Postman ou o Swagger UI. A documentação Swagger da API está disponível em /api.

### A API possui as seguintes rotas:
Foram criadas diversas rotas para a criação do usuário como findOne, findAll, Create, Delete e Update, mas a principal para o desafio é a seguinte:

http://localhost:3000/transactions/batch

Para ela, será necessário passar o seguinte JSON:

```bash
{
  "accounts": [
    {
      "accountNumber": 1234,
      "balance": 500
    },
    {
      "accountNumber": 4567,
      "balance": 1000
    }
  ],
  "transactions": [
    {
      "type": "transfer",
      "originAccount": 1234,
      "destinationAccount": 4567,
      "amount": 200
    },
    {
      "type": "withdraw",
      "originAccount": 4561,
      "amount": 50
    }
  ]
}

```
Onde foi criado a seguinte regra, cada objeto seria uma requisição independente da outra, então caso uma falhe a outra prosseguirá com a solicitação e no final será retornado quais transações tiveram erro.
Uma regra adotada é que no array de Accounts, caso a conta não exista no banco de dados, ela é criada.

No exemplo fornecido acima, você receberá o seguinte retorno já que a conta não exista para o withdraw:

```bash
{
    "processedAccounts": [
        {
            "accountNumber": 1234,
            "balance": 500,
            "id": 3
        },
        {
            "accountNumber": 4567,
            "balance": 1000,
            "id": 4
        }
    ],
    "processedTransactions": [
        {
            "type": "transfer",
            "originAccount": 1234,
            "destinationAccount": 4567,
            "amount": 200,
            "id": 13,
            "date": "2024-10-27T16:41:37.754Z"
        }
    ],
    "errors": [
        {
            "accountNumber": 4561,
            "error": "Account not found"
        }
    ]
}
```
