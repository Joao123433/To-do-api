# Sistema de Gerenciamento de Tarefas

## 🚀 Tecnologias

Este projeto foi desenvolvido com o objetivo de refatorar a API de um sistema anterior, utilizando o framework NestJS. Além disso, serviu como exercício prático para fixar os conceitos aprendidos durante os estudos, como arquitetura em módulos, autenticação com JWT, integração com Prisma ORM e estruturação de testes.

- **Backend:** Nest.js + Fastify + Prisma ORM + PostgreSQL
- **Autenticação:** JWT para login de usuário e proteção de rotas
- **Documentação:** Swagger para documentação interativa da API

## 📂 Estrutura do Projeto

```
/src
│── app/               # Módulo principal da aplicação
│── auth/              # Módulo de autenticação
│   ├── common/        # Constantes relacionadas à autenticação
│   ├── config/        # Configurações JWT
│   ├── dto/           # Data Transfer Objects (login, payload, response)
│   ├── hash/          # Serviços de hashing (bcrypt)
│   ├── params/        # Parâmetros usados na autenticação
│   ├── tests/         # Testes de autenticação
│── common/            # Recursos compartilhados
│   ├── dto/           # DTOs compartilhados (ex: paginação)
│   ├── filters/       # Filtros de exceções globais
│   ├── interceptors/  # Interceptadores (ex: logger)
│   ├── middlewares/   # Middlewares de autenticação
│── priorities/        # Módulo de prioridades de tarefas
│   ├── tests/         # Testes do módulo de prioridades
│── prisma/            # Integração com Prisma ORM
│   ├── tests/         # Testes do serviço do Prisma
│── status/            # Módulo de status das tarefas
│   ├── tests/         # Testes do módulo de status
│── tasks/             # Módulo de tarefas
│   ├── dto/           # DTOs de tarefas
│   ├── entities/      # Entidades de tarefas
│   ├── tests/         # Testes de tarefas
│── users/             # Módulo de usuários
│   ├── dto/           # DTOs de usuários
│   ├── tests/         # Testes do módulo de usuários
│── main.ts            # Ponto de entrada da aplicação
```

## 🔐 Autenticação

O sistema utiliza autenticação baseada em JWT (JSON Web Token).

- Login via e-mail e senha
- Armazenamento seguro do token
- Endpoints protegidos exigem token JWT
- Validade de token limitada a 1 hora
- Senhas encriptadas com bcrypt

## 📑 Documentação da API

A documentação da API está disponível via Swagger no seguinte endereço:

```bash
http://localhost:3000/docs
```

## ⚙️ Configuração de Linter e Formatter

Foi realizada a migração do ESLint e Prettier para o Biome para simplificar e melhorar a experiência de desenvolvimento. O Biome agora é responsável pela formatação e verificação de código no projeto.

## 📦 Dependências do Projeto

O projeto utiliza as seguintes dependências principais e de desenvolvimento para garantir o funcionamento correto da aplicação e o ambiente de desenvolvimento:

### Dependências Principais
- **@nestjs/common**, **@nestjs/core**, **@nestjs/platform-express**: Framework NestJS para estruturação do backend.
- **@nestjs/jwt**: Autenticação baseada em JWT.
- **@nestjs/swagger**, **swagger-ui-express**: Para gerar a documentação da API automaticamente.
- **@prisma/client**: Integração com o Prisma ORM para manipulação do banco de dados.
- **bcryptjs**: Para criptografia de senhas.
- **class-transformer**, **class-validator**: Para validação de dados e transformação de objetos.

### Dependências de Desenvolvimento
- **@biomejs/biome**: Ferramenta para linting e formatação de código, substituindo o ESLint e Prettier.
- **jest**, **supertest**, **ts-jest**: Frameworks e bibliotecas para testes unitários.
- **prisma**: Ferramenta de migração e gerenciamento do banco de dados.
- **typescript**, **ts-node**, **ts-loader**: Ferramentas para transpilar e executar TypeScript no ambiente de desenvolvimento.

## 🛠️ Instalação e Configuração

### 1️⃣ Clonar o Repositório

```sh
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
yarn
```

### 2️⃣ Configurar a API

```sh
cd src
cp .env.example .env          # Configure as variáveis de ambiente
yarn prisma migrate dev       # Executa as migrações
yarn seed                     # (OBRIGATORIO) Popula o banco de dados
yarn start:dev                # Inicia o servidor
```

A API estará disponível em `http://localhost:3000`.