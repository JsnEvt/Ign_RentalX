# RentX – Backend (Rocketseat)

> API de aluguel de carros construída durante a trilha Node.js (Ignite/Rocketseat). Projeto com foco em arquitetura limpa, SOLID, autenticação, documentação, testes e deploy containerizado.

---

## 🔖 Sumário

* [Visão Geral](#-visão-geral)
* [Principais Recursos](#-principais-recursos)
* [Arquitetura & Padrões](#-arquitetura--padrões)
* [Estrutura de Pastas](#-estrutura-de-pastas)
* [Domínios / Módulos](#-domínios--modulos)
* [Fluxos Importantes](#-fluxos-importantes)
* [Erros & Validações](#-erros--validacoes)
* [Autenticação & Autorização](#-autenticacao--autorizacao)
* [ORM & Banco de Dados](#-orm--banco-de-dados)
* [Middlewares](#-middlewares)
* [Providers (Data, Token, Storage, Mail)](#-providers-data-token-storage-mail)
* [Documentação com Swagger](#-documentacao-com-swagger)
* [Configuração de Ambiente](#-configuracao-de-ambiente)
* [Testes](#-testes)
* [Scripts NPM/Yarn](#-scripts-npmyarn)
* [Padrões de Código](#-padroes-de-codigo)
* [Licença](#-licenca)
* [Créditos](#-creditos)



---

## 🧭 Visão Geral

API REST para gerenciar **usuários**, **carros**, **categorias**, **especificações** e **alugueis (rentals)**. Oferece autenticação JWT, upload de arquivos (ex.: avatar e imagens do carro), documentação com Swagger, e integrações com serviços como **PostgreSQL**, **Redis**, **Amazon S3/SES** (opcional) — tudo orquestrado via **Docker**.

---

## ✨ Principais Recursos

* Cadastro/Login de usuários
* Recuperação de senha (token temporário via e-mail)
* Cadastro de categorias e especificações (admin)
* Cadastro/gestão de carros e disponibilidade
* Upload de imagens de carros e avatar do usuário
* Criação, devolução e listagem de **rentals**
* Autenticação JWT + refresh token
* Rate limiting e proteção de rotas
* Documentação interativa (Swagger UI)
* Migrations, Seeds e Repositórios (TypeORM)
* Injeção de dependência com **tsyringe**
* Providers intercambiáveis (Storage, Mail, Date, Token)
* Testes (unitários e de integração) com **Jest**/**Supertest**
* Padronização com **ESLint**/**Prettier**

---

## 🏗️ Arquitetura & Padrões

* **SOLID** e **Clean Architecture**: casos de uso isolados do framework HTTP.
* **DDD (leve)** por módulos: `modules/<domínio>` com **useCases**, **entities**, **repositories**, **dtos**, **infra**.
* **Injeção de Dependência** com `tsyringe` (container em `shared/container`).
* **Interfaces x Implementations**: repositórios e providers definidos por contratos.
* **Camada HTTP**: `infra/http` com controllers, routes e middlewares.
* **Camada de Persistência**: `infra/typeorm` com entities, migrations e repositórios.
* **Tratamento centralizado de erros** via middleware e classe `AppError`.
* **Separação de Providers**: `shared/container/providers` (Date, Token, Storage, Mail, Hash, Cache/RateLimiter).

---

## 📂 Estrutura de Pastas
Veja a estrutura completa do projeto em [tree.txt](./tree.txt).


## 🧩 Domínios / Módulos

### Accounts

* Usuários, perfis, avatar, autenticação, recuperação de senha.

### Cars

* Categorias, especificações, carros, imagens dos carros, disponibilidade.

### Rentals

* Aluguel (criação, devolução, listagem por usuário), regras de negócio de datas e multas.

---

## 🔁 Fluxos Importantes

### Cadastro e login

1. Usuário cria conta → recebe hash de senha **bcrypt**.
2. Login gera **access token (JWT)** e **refresh token** (persistido, expira por data).
3. `refresh-token` emite novo **access token** mantendo sessão.

### Recuperação de senha

1. Usuário solicita reset → gera token temporário (expira via **dayjs**).
2. E-mail é enviado (Ethereal/SES) com link contendo token.
3. Endpoint de reset altera senha e invalida token.

### Aluguel de carro

1. Verifica disponibilidade do carro e se usuário já possui aluguel em aberto.
2. Calcula datas mínimas e multa usando **DateProvider (dayjs)**.
3. Persiste rental e atualiza disponibilidade do carro.

---

## 🧯 Erros & Validações

* Classe `AppError(message, statusCode)` lança erros de negócio.
* **Middleware global de erros** captura exceções, padroniza JSON e status HTTP.
* **class-validator** para validação de DTOs e inputs.

---

## 🔐 Autenticação & Autorização

* **JWT** com `jsonwebtoken` (payload mínimo: `sub` = user\_id, `roles`/`isAdmin`).
* **Refresh Token** com persistência (TypeORM), expiração via **dayjs**.
* Middlewares: `ensureAuthenticated` e `ensureAdmin`.

---

## 🗃️ ORM & Banco de Dados

* **TypeORM** com **PostgreSQL** (default).
* **Entities** por domínio; **Migrations** versionam o schema.
* Repositórios concretos (`TypeORMRepository`) implementam contratos (`IRepository`).

**Comandos úteis**

```bash
yarn typeorm migration:run
yarn typeorm migration:revert
yarn typeorm migration:generate -n <Nome>
```

---

## 🧵 Middlewares

* **Logger** (req/res) e **cors**.
* **Error Handler** centralizado.
* **ensureAuthenticated** / **ensureAdmin**.
* **Multer** para upload de arquivos (avatar, imagens do carro).

---

## 🔌 Providers (Data, Token, Storage, Mail)

* **DateProvider**: base em **dayjs** (diferenças, add/sub, comparações).
* **TokenProvider**: emissão/validação de **JWT** e **refresh tokens**.
* **StorageProvider**: `LocalStorageProvider` e `S3StorageProvider`.
* **MailProvider**: `EtherealMailProvider` e/ou `SESMailProvider`.
* **HashProvider**: `BCryptHashProvider` para senhas.

Configuração por **variáveis de ambiente** e registro no container (`shared/container`).

---

## 📘 Documentação com Swagger

* **Swagger UI** montado em `/api-docs`.
* YAML/JSON em `src/shared/infra/http/swagger.json`.
* Exemplos de schemas, parâmetros e respostas padronizados.

Acesse após subir a API: `http://localhost:3333/api-docs`.

---

## ⚙️ Configuração de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```## API_URLs
FORGOT_MAIL_URL=http://localhost:xxxxpassword/reset?token=
APP_API_URL=


## AWS Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
AWS_BUCKET_REGION=
AWS_BUCKET_URL=
AWS_REGION=

## Storage
disk=

## Email
MAIL_PROVIDER=
```

---

## 🧪 Testes

* **Jest** + **ts-jest** para unitários.
* **Supertest** para integração (subindo app em memória).
* Banco isolado (ex.: SQLite in-memory) ou testcontainers.

**Rodar testes**

```bash
yarn test
```

**Cobertura**

```bash
yarn test:coverage
```

---

## 🧰 Scripts NPM/Yarn

```json
{
    "build": "babel src --extensions \".js, .ts\" --out-dir dist --copy-files",
    "dev": "ts-node-dev -r tsconfig-paths/register --inspect --transpile-only --ignore-watch node_modules --respawn src/shared/infra/http/server.ts",
    "typeorm": "ts-node-dev -r tsconfig-paths/register ./node_modules/typeorm/cli",
    "test": "cross-env NODE_ENV=test jest --runInBand --detectOpenHandles",
    "seed:admin": "ts-node-dev src/shared/infra/typeorm/seed/admin.ts"
}
```

---

## 🎯 Padrões de Código

* **ESLint** + **Prettier** + **EditorConfig**.

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE).

---
## 📝 Créditos

Este projeto foi desenvolvido no curso **Ignite** da **Rocketseat**, com orientação da professora **Daniela Evangelista**.





