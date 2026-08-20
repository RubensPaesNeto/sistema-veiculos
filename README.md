# Sistema de Trânsito

Aplicação web para gerenciamento de veículos, com cadastro de usuários,
autenticação e CRUD completo — desenvolvida como projeto de estudo e
portfólio.

## Funcionalidades

- Cadastro e login de usuários (com senha criptografada e autenticação via JWT)
- Cadastro de veículos com validação de dados (modelo, placa, ano e cor obrigatórios; placa única)
- Listagem de veículos cadastrados
- Consulta de veículo por ID
- Edição e exclusão de veículos
- Mensagens de sucesso e erro para o usuário
- Tratamento de erros com página de erro dedicada
- Layout responsivo, minimalista, com identidade visual própria

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars) (server-side rendering)
- [Prisma ORM](https://www.prisma.io/)
- SQLite
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senhas

## Arquitetura

O projeto segue o padrão **MVC** (Model-View-Controller) com rotas RESTful
e renderização no servidor:

```
sistema-transito/
│
├── controllers/          # Regras de negócio
│   ├── VeiculoController.js
│   └── UsuarioController.js
│
├── routes/                # Definição das rotas
│   ├── veiculoRoutes.js
│   └── usuarioRoutes.js
│
├── middlewares/           # Middlewares (autenticação, sessão, mensagens flash)
│   ├── flash.js
│   └── usuarioLogado.js
│
├── prisma/
│   └── schema.prisma      # Modelagem do banco de dados
│
├── public/
│   ├── css/style.css      # Estilização
│   └── js/script.js
│
├── views/
│   ├── layouts/main.handlebars
│   ├── home.handlebars
│   ├── erro.handlebars
│   ├── veiculos/
│   │   ├── lista.handlebars
│   │   ├── cadastro.handlebars
│   │   ├── editar.handlebars
│   │   └── detalhes.handlebars
│   └── usuarios/
│       ├── login.handlebars
│       └── cadastro.handlebars
│
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Como rodar o projeto

1. Clone o repositório e instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e preencha com seus dados:

   ```bash
   cp .env.example .env
   ```

3. Rode as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

4. Inicie o servidor:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:8000](http://localhost:8000).

## Rotas principais

| Método | Rota                    | Descrição                        |
|--------|--------------------------|-----------------------------------|
| GET    | `/`                       | Página inicial                    |
| GET    | `/veiculos/todos`         | Lista de veículos                 |
| GET    | `/veiculos/cadastro`      | Formulário de cadastro            |
| POST   | `/veiculos/cadastro`      | Cria um veículo                   |
| GET    | `/veiculos/buscar/:id`    | Detalhes de um veículo            |
| GET    | `/veiculos/editar/:id`    | Formulário de edição              |
| POST   | `/veiculos/editar/:id`    | Atualiza um veículo               |
| POST   | `/veiculos/deletar/:id`   | Remove um veículo                 |
| GET    | `/usuarios/cadastro`      | Formulário de criação de conta    |
| POST   | `/usuarios/cadastro`      | Cria um usuário                   |
| GET    | `/usuarios/login`         | Formulário de login               |
| POST   | `/usuarios/login`         | Autentica o usuário                |
| POST   | `/usuarios/logout`        | Encerra a sessão                  |

## Autor
Rubens Paes Neto
