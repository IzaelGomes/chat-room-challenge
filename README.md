# Chat Room

Uma aplicação de chat em tempo real com salas de conversa, autenticação de usuários e interface moderna.

## Tecnologias

### Backend

- **Node.js** com **Express**
- **Prisma** como ORM
- **PostgreSQL** como banco de dados
- **WebSocket** para comunicação em tempo real
- **TypeScript** para tipagem estática

### Frontend

- **React** com **TypeScript**
- **Vite** como bundler
- **Chakra UI** para componentes de interface
- **React Query** para data fetching
- **React Router** para navegação
- **WebSocket** para comunicação em tempo real

## Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm**
- **Git**

## Setup do Projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd chat-room
```

### 2. Setup do Backend

```bash
# Entre na pasta do servidor
cd server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
Crie um arquivo na raiz da pasta server
```

**Configure o arquivo `.env`:**

```env
# Database (usando Docker)
DATABASE_URL="postgresql://docker:12345678@localhost:5432/chat"

# Server
PORT=3001
FRONTEND_URL=http://localhost:5173

# JWT Secret (gere uma chave aleatória)
JWT_SECRET=sua_chave_secreta_aqui
```

**Suba o banco de dados:**

```bash

# Instale o postgresql ou suba o PostgreSQL usando Docker
docker-compose up -d

# Execute as migrações
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate
```

**Inicie o servidor:**

```bash
npm run dev
```

### 3. Setup do Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd web

# Instale as dependências
npm install

# Configure as variáveis de ambiente
Crie um arquivo na raiz da pasta web
```

**Configure o arquivo `.env`:**

```env
# API URL
VITE_API_URL=http://localhost:3001
```

**Inicie o frontend:**

```bash
npm run dev
```


