# ❄️ Refrigeração do Jair — Sistema de Gestão de Ordens de Serviço e Atendimento

Sistema web completo (Full-Stack) desenvolvido para gerenciamento de ordens de serviço (OS), agendamentos técnicos, controle de estoque de peças, catálogo de serviços, orçamentos e portal de autoatendimento do cliente no setor de refrigeração e climatização.

O projeto também conta com uma arquitetura de **Replicação de Dados em Tempo Real entre Bancos PostgreSQL (Primary + Standby Replica)** utilizando `postgres_fdw` e Triggers PL/pgSQL com auditoria automática.

---

## 👥 Autores

- **Caio Huzar**
- **Raoni S.**
- **Vitor Werle**
- **Carlos Dozorets**
- **Henrique de Moura**
- **Eduardo Valtrim**

---

## 🚀 Tecnologias Utilizadas

### Backend (`Back/`)
- **Node.js** + **Express 5** — API RESTful
- **Sequelize ORM** + **pg** — Integração e modelagem com PostgreSQL
- **PostgreSQL 18** — Banco de dados relacional principal (`projeto_refri`) e réplica (`projeto_refri_replica`)
- **Foreign Data Wrapper (`postgres_fdw`) & PL/pgSQL Triggers** — Replicação automática em tempo real e auditoria em JSONB
- **Autenticação JWT (`jsonwebtoken`) & Hash `scrypt` (`crypto`)** — Segurança de rotas e controle de escopo por cargo (`cliente` vs `funcionario`)
- **Swagger UI (`swagger-ui-express`)** — Documentação interativa da API em `/docs`
- **Node Test Runner (`node:test`)** — Testes automatizados de segurança, escopo e replicação

### Frontend (`Front/`)
- **React 19** + **Vite** — Interface rápida e moderna para o Portal do Cliente
- **React Router DOM v7** — Roteamento de páginas (Login, Cadastro, Solicitação de Serviço, Minha Conta e Acompanhamento)
- **Lucide React** — Ícones visuais

---

## 📂 Estrutura do Projeto

```text
Projeto_Refrigeracao/
├── Back/
│   ├── config/
│   │   ├── database.js            # Conexão Sequelize com o Banco Principal e Banco Réplica
│   │   └── replicacaoSetup.js     # Configuração automática de FDW, Triggers e Sync Inicial
│   ├── controllers/               # Regras de negócio (Auth, Clientes, OS, Orçamentos, Replicação, etc.)
│   ├── middleware/                # Autenticação JWT e validação de permissões/cargos
│   ├── models/                    # Modelos Sequelize das 10 tabelas do sistema
│   ├── routes/                    # Rotas da API REST
│   ├── swagger/                   # Especificações OpenAPI 3.0 de todos os módulos
│   ├── tests/                     # Testes automatizados (autenticação, escopo e replicação)
│   ├── utils/                     # Utilitários de criptografia (scrypt), escopo e erros HTTP
│   ├── banco.sql                  # Script DDL de criação das tabelas, tipos ENUM e triggers
│   ├── replicacao.sql             # Script SQL documentado da arquitetura de replicação e consultas
│   ├── comprovar_replicacao.js    # Script CLI para demonstração e comprovação da replicação ao vivo
│   └── index.js                   # Ponto de entrada do servidor Express
├── Front/
│   ├── src/
│   │   ├── components/            # Cabeçalho do Portal e identidade visual (Brand)
│   │   ├── pages/                 # Login, Cadastro, Portal, Solicitação de Atendimento e Conta
│   │   └── services/              # Integração HTTP com a API do Backend
│   └── vite.config.js             # Configuração do servidor Vite
└── README.md                      # Documentação principal do projeto
```

---

## ⚙️ Pré-requisitos e Instalação

1. **Node.js** (v18 ou superior)
2. **PostgreSQL** (v14 ou superior — testado no PostgreSQL 18) rodando localmente na porta `5432`

### 1. Configurar o Banco de Dados e o Backend

```bash
cd Back
npm install
```

Copie o arquivo `.env.example` para `.env` dentro da pasta `Back/` e preencha com suas credenciais do PostgreSQL:

```env
DB_NAME=projeto_refri
DB_REPLICA_NAME=projeto_refri_replica
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=segredo_jwt_com_pelo_menos_32_caracteres_seguros
PORT=3000
```

> **Nota:** Crie o banco principal `projeto_refri` no PostgreSQL e execute o script [Back/banco.sql](Back/banco.sql) caso ainda não exista. O banco secundário (`projeto_refri_replica`), o Foreign Data Wrapper (`postgres_fdw`) e todas as triggers de replicação são **criados e sincronizados automaticamente** assim que o servidor Backend é iniciado!

Para iniciar o Backend:
```bash
node index.js
```
- **API:** `http://localhost:3000`
- **Documentação Swagger:** `http://localhost:3000/docs`

### 2. Configurar e Iniciar o Frontend

Em outro terminal, acesse a pasta `Front/`:

```bash
cd Front
npm install
npm run dev
```
- **Portal do Cliente:** `http://localhost:5173`

---

## 🔄 Replicação de Dados em Tempo Real (PostgreSQL Primary -> Replica)

O projeto implementa replicação automática em nível de banco de dados entre **`projeto_refri`** (Principal) e **`projeto_refri_replica`** (Réplica):

1. **Mapeamento Estrangeiro (`postgres_fdw`)**: O banco principal conecta-se ao banco réplica através do servidor estrangeiro `servidor_replica` e importa suas tabelas no schema `replica_remote`.
2. **Triggers em Tempo Real (`AFTER INSERT OR UPDATE OR DELETE`)**: Todas as 10 tabelas do sistema (`usuarios`, `clientes`, `tecnicos`, `servicos`, `pecas`, `os`, `os_pecas`, `horarios_disponiveis`, `agendamentos` e `orcamentos`) possuem triggers que propagam qualquer alteração imediatamente para o banco réplica na mesma transação.
3. **Auditoria (`log_replicacao`)**: Cada operação replicada grava automaticamente um registro na tabela `log_replicacao` (presente em ambos os bancos) contendo a tabela afetada, tipo de operação (`INSERT`, `UPDATE`, `DELETE`, `SYNC_INICIAL`), ID do registro, estado anterior (`dados_antigos` em JSONB), estado novo (`dados_novos` em JSONB) e data/hora exata.

### Como Comprovar a Replicação

- **Via Script no Terminal:**
  ```bash
  cd Back
  npm run comprovar-replicacao
  ```
  Exibe o quadro comparativo de todas as 10 tabelas nos dois bancos e executa um teste real de `INSERT`, `UPDATE` e `DELETE` comprovando a sincronia imediata e listando os registros gerados em `log_replicacao`.

- **Via Swagger UI (`http://localhost:3000/docs` — seção *Replicacao de Dados*):**
  - `GET /replicacao/status`: Relatório completo de sincronia das 10 tabelas, triggers ativas e últimos eventos replicados.
  - `POST /replicacao/testar`: Executa um ciclo completo de `INSERT`, `UPDATE` e `DELETE` no banco principal e retorna os dados lidos diretamente da réplica.
  - `GET /replicacao/comparar/{tabela}`: Compara lado a lado os registros de qualquer tabela no banco principal e no banco réplica.
  - `POST /replicacao/sincronizar`: Força a verificação estrutural e sincronização de dados pendentes.

- **Via Consultas SQL no pgAdmin / DBeaver:**
  Consulte os scripts prontos de verificação no arquivo [Back/replicacao.sql](Back/replicacao.sql).

---

## 🔐 Autenticação e Controle de Escopo

- **`POST /auth/login`**: Recebe `email` e `senha`, valida o hash `scrypt` e retorna um token JWT válido por 1 hora.
- **Isolamento de Clientes (`cargo: cliente`)**: Nas rotas autenticadas (`/clientes`, `/os`, `/agendamentos`, `/orcamentos`), o servidor identifica automaticamente o `id_cliente` vinculado ao token JWT. Um cliente autenticado jamais consegue visualizar ou alterar dados de outro cliente.
- **Operações Administrativas (`cargo: funcionario`)**: Técnicos e funcionários possuem permissão para gerenciar ordens de serviço, confirmar agendamentos e atualizar status de orçamentos.

---

## 🧪 Testes Automatizados

Para executar toda a suíte de testes (hash de senha `scrypt`, isolamento de escopo de clientes e replicação em tempo real entre bancos PostgreSQL):

```bash
cd Back
npm test
```

---

## 📄 Licença

Distribuído sob a licença **ISC**. Veja o arquivo [Back/LICENSE](Back/LICENSE) para mais informações.
