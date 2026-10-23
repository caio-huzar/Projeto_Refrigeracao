CREATE TYPE enum_usuarios_cargo AS ENUM ('cliente', 'funcionario');
CREATE TYPE enum_os_status AS ENUM (
    'aberta',
    'agendada',
    'em_andamento',
    'concluida',
    'cancelada'
);
CREATE TYPE enum_agendamentos_status AS ENUM (
    'pendente',
    'confirmado',
    'cancelado'
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cargo enum_usuarios_cargo NOT NULL,
    esta_ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuarios(id),
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(11) NOT NULL UNIQUE,
    cpf_cnpj VARCHAR(14) NOT NULL UNIQUE,
    rua VARCHAR(100) NOT NULL,
    numero_casa INTEGER NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(30) NOT NULL
);

CREATE TABLE tecnicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(11),
    esta_ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao VARCHAR(1000),
    valor DECIMAL(6, 2) NOT NULL
);

CREATE TABLE pecas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(500),
    preco_custo DECIMAL(5, 2),
    preco_venda DECIMAL(5, 2) NOT NULL,
    quantidade INTEGER NOT NULL,
    fornecedor VARCHAR(100),
    codigo_barras INTEGER UNIQUE
);

CREATE TABLE os (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL REFERENCES clientes(id),
    id_tecnico INTEGER NOT NULL REFERENCES tecnicos(id),
    eletrodomestico VARCHAR(100) NOT NULL,
    descricao_problema VARCHAR(1000) NOT NULL,
    data_agendada TIMESTAMP WITH TIME ZONE,
    status enum_os_status DEFAULT 'aberta',
    aberta_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizada_em TIMESTAMP WITH TIME ZONE,
    id_servico INTEGER REFERENCES servicos(id),
    id_peca INTEGER REFERENCES pecas(id),
    quantidade_pecas INTEGER
);

CREATE TABLE os_pecas (
    id SERIAL PRIMARY KEY,
    id_os INTEGER NOT NULL REFERENCES os(id),
    id_peca INTEGER NOT NULL REFERENCES pecas(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL,
    UNIQUE (id_os, id_peca)
);

CREATE TABLE horarios_disponiveis (
    id SERIAL PRIMARY KEY,
    id_tecnico INTEGER NOT NULL REFERENCES tecnicos(id),
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    duracao_minutos INTEGER NOT NULL DEFAULT 60 CHECK (duracao_minutos > 0),
    esta_ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (hora_inicio < hora_fim)
);

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL REFERENCES clientes(id),
    id_tecnico INTEGER NOT NULL REFERENCES tecnicos(id),
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    status enum_agendamentos_status NOT NULL DEFAULT 'pendente',
    observacao VARCHAR(1000),
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE
);

CREATE OR REPLACE FUNCTION atualizar_data_modificacao()
RETURNS TRIGGER AS $$
BEGIN
   NEW.atualizado_em = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_atualizado_em
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_modificacao('atualizado_em');

CREATE TRIGGER trg_agendamentos_atualizado_em
BEFORE UPDATE ON agendamentos
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_modificacao('atualizado_em');

CREATE TRIGGER trg_os_atualizada_em
BEFORE UPDATE ON os
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_modificacao('atualizada_em');

CREATE TABLE orcamentos (
    id SERIAL PRIMARY KEY,
    id_os INTEGER NOT NULL REFERENCES os(id),
    valor NUMERIC(10, 2) NOT NULL CHECK (valor >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'rascunho'
        CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'recusado', 'cancelado')),
    validade DATE,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_orcamentos_atualizado_em
BEFORE UPDATE ON orcamentos
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_modificacao('atualizado_em');
