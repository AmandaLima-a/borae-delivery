# 🍔 Boraê Delivery

![Boraê Delivery](frontend/public/borae-preview.webp)

Aplicação web de delivery desenvolvida com React.js, Node.js, Express e PostgreSQL, simulando o funcionamento de uma plataforma de pedidos online.

O projeto foi desenvolvido para praticar e integrar tecnologias de desenvolvimento Front-end e Back-end, incluindo consumo de API, gerenciamento de estado, persistência de dados e operações com banco de dados relacional.

## 🚀 Tecnologias utilizadas

### Front-end
- React.js
- Vite
- JavaScript
- CSS
- Axios
- Lucide React

### Back-end
- Node.js
- Express
- PostgreSQL
- node-postgres (pg)
- CORS
- dotenv

## ✨ Funcionalidades

- Catálogo de produtos organizado por categorias.
- Busca e filtros de produtos.
- Carrinho de compras com adição e remoção de itens.
- Observações personalizadas por produto.
- Formulário de finalização de pedido.
- Cálculo automático do valor total no servidor.
- Cadastro e consulta de pedidos.
- Histórico de pedidos.
- Persistência de dados no PostgreSQL.
- Interface responsiva para diferentes dispositivos.

## 📁 Estrutura do projeto

Delivery/
├── frontend/
│   └── src/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── products.sql
│   └── src/
│       ├── config/
│       ├── routes/
│       └── server.js
└── README.md

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js
- npm
- PostgreSQL

### 1. Clonar o repositório

    git clone URL_DO_REPOSITORIO

### 2. Configurar o banco de dados

Crie um banco de dados PostgreSQL e execute os arquivos SQL nesta ordem:

1. `backend/database/schema.sql`
2. `backend/database/products.sql`

### 3. Configurar o Back-end

Entre na pasta:

    cd backend

Instale as dependências:

    npm install

Crie um arquivo `.env` na pasta `backend`, seguindo o exemplo:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=borae

Inicie o servidor:

    npm run dev

### 4. Configurar o Front-end

Abra outro terminal e entre na pasta:

    cd frontend

Instale as dependências:

    npm install

Inicie a aplicação:

    npm run dev

A aplicação estará disponível no endereço informado pelo Vite, normalmente:

http://localhost:5173

## 📌 Objetivo do projeto

O Boraê foi desenvolvido como projeto de estudo e portfólio, com o objetivo de consolidar conhecimentos em desenvolvimento web, integração entre Front-end e Back-end, construção de APIs REST e utilização de banco de dados PostgreSQL.