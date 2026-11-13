-- ============================================================================
-- ARQUITETURA DE REPLICACAO DE DADOS - PROJETO REFRIGERACAO DO JAIR
-- ============================================================================
-- Este arquivo documenta a estrutura de replicacao em tempo real entre:
--   1. Banco Principal (Primary): projeto_refri
--   2. Banco Replica  (Standby):  projeto_refri_replica
--
-- Mecanismo utilizado no PostgreSQL:
--   - Extensao `postgres_fdw` (Foreign Data Wrapper) + `dblink`
--   - Servidor estrangeiro `servidor_replica` apontando para `projeto_refri_replica`
--   - Schema `replica_remote` contendo as Foreign Tables mapeadas 1:1
--   - Triggers AFTER INSERT OR UPDATE OR DELETE em todas as 10 tabelas do
--     banco principal, replicando imediatamente para a replica e gravando
--     rastro de auditoria na tabela `log_replicacao` (em ambos os bancos).
-- ============================================================================

-- 1. Criacao da tabela de auditoria de replicacao (no Primary e na Replica)
CREATE TABLE IF NOT EXISTS log_replicacao (
    id SERIAL PRIMARY KEY,
    tabela VARCHAR(100) NOT NULL,
    operacao VARCHAR(20) NOT NULL,
    registro_id INTEGER,
    origem_db VARCHAR(100) NOT NULL DEFAULT 'projeto_refri',
    destino_db VARCHAR(100) NOT NULL DEFAULT 'projeto_refri_replica',
    dados_antigos JSONB,
    dados_novos JSONB,
    replicado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Habilitacao do Foreign Data Wrapper no banco principal (`projeto_refri`)
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

CREATE SERVER IF NOT EXISTS servidor_replica
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'localhost', port '5432', dbname 'projeto_refri_replica');

CREATE USER MAPPING IF NOT EXISTS FOR CURRENT_USER
    SERVER servidor_replica
    OPTIONS (user 'postgres', password 'postgres');

CREATE SCHEMA IF NOT EXISTS replica_remote;

IMPORT FOREIGN SCHEMA public
    FROM SERVER servidor_replica
    INTO replica_remote;

-- 3. Exemplo de Funcao e Trigger de Replicacao Automatica (gerada para as 10 tabelas)
-- As funcoes `fn_replicar_<tabela>()` capturam TG_OP ('INSERT', 'UPDATE', 'DELETE'),
-- propagam a alteracao para `replica_remote.<tabela>` e registram o evento em
-- `public.log_replicacao` e `replica_remote.log_replicacao`.

-- ============================================================================
-- CONSULTAS SQL PARA COMPROVACAO (ATIVIDADE ESCOLAR)
-- ============================================================================

-- A) Comparar a contagem de registros entre o Banco Principal e o Banco Replica:
/*
SELECT
    'usuarios' AS tabela,
    (SELECT COUNT(*) FROM public.usuarios) AS total_principal,
    (SELECT COUNT(*) FROM replica_remote.usuarios) AS total_replica
UNION ALL
SELECT 'clientes', (SELECT COUNT(*) FROM public.clientes), (SELECT COUNT(*) FROM replica_remote.clientes)
UNION ALL
SELECT 'tecnicos', (SELECT COUNT(*) FROM public.tecnicos), (SELECT COUNT(*) FROM replica_remote.tecnicos)
UNION ALL
SELECT 'servicos', (SELECT COUNT(*) FROM public.servicos), (SELECT COUNT(*) FROM replica_remote.servicos)
UNION ALL
SELECT 'pecas', (SELECT COUNT(*) FROM public.pecas), (SELECT COUNT(*) FROM replica_remote.pecas)
UNION ALL
SELECT 'os', (SELECT COUNT(*) FROM public.os), (SELECT COUNT(*) FROM replica_remote.os)
UNION ALL
SELECT 'os_pecas', (SELECT COUNT(*) FROM public.os_pecas), (SELECT COUNT(*) FROM replica_remote.os_pecas)
UNION ALL
SELECT 'horarios_disponiveis', (SELECT COUNT(*) FROM public.horarios_disponiveis), (SELECT COUNT(*) FROM replica_remote.horarios_disponiveis)
UNION ALL
SELECT 'agendamentos', (SELECT COUNT(*) FROM public.agendamentos), (SELECT COUNT(*) FROM replica_remote.agendamentos)
UNION ALL
SELECT 'orcamentos', (SELECT COUNT(*) FROM public.orcamentos), (SELECT COUNT(*) FROM replica_remote.orcamentos);
*/

-- B) Consultar o historico de eventos replicados em tempo real:
/*
SELECT id, tabela, operacao, registro_id, origem_db, destino_db, replicado_em
FROM log_replicacao
ORDER BY id DESC
LIMIT 20;
*/
