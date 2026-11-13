const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const sequelize = require('./database');

const TABELAS_ORDENADAS = [
  {
    nome: 'usuarios',
    colunas: ['id', 'email', 'senha_hash', 'cargo', 'esta_ativo', 'criado_em', 'atualizado_em']
  },
  {
    nome: 'clientes',
    colunas: ['id', 'id_usuario', 'nome', 'telefone', 'cpf_cnpj', 'rua', 'numero_casa', 'bairro', 'cep', 'cidade', 'estado']
  },
  {
    nome: 'tecnicos',
    colunas: ['id', 'nome', 'telefone', 'esta_ativo', 'criado_em']
  },
  {
    nome: 'servicos',
    colunas: ['id', 'nome', 'descricao', 'valor']
  },
  {
    nome: 'pecas',
    colunas: ['id', 'nome', 'descricao', 'preco_custo', 'preco_venda', 'quantidade', 'fornecedor', 'codigo_barras']
  },
  {
    nome: 'os',
    colunas: ['id', 'id_cliente', 'id_tecnico', 'eletrodomestico', 'descricao_problema', 'data_agendada', 'status', 'aberta_em', 'atualizada_em', 'id_servico', 'id_peca', 'quantidade_pecas']
  },
  {
    nome: 'os_pecas',
    colunas: ['id', 'id_os', 'id_peca', 'quantidade', 'preco_unitario']
  },
  {
    nome: 'horarios_disponiveis',
    colunas: ['id', 'id_tecnico', 'dia_semana', 'hora_inicio', 'hora_fim', 'duracao_minutos', 'esta_ativo']
  },
  {
    nome: 'agendamentos',
    colunas: ['id', 'id_cliente', 'id_tecnico', 'data_hora', 'status', 'observacao', 'criado_em', 'atualizado_em']
  },
  {
    nome: 'orcamentos',
    colunas: ['id', 'id_os', 'valor', 'status', 'validade', 'criado_em', 'atualizado_em']
  }
];

function gerarFuncaoETriggerSQL(tabela, colunas, primaryDb, replicaDb) {
  const colsList = colunas.join(', ');
  const newColsList = colunas.map((c) => `NEW.${c}`).join(', ');
  const updateSetList = colunas
    .filter((c) => c !== 'id')
    .map((c) => `${c} = NEW.${c}`)
    .join(', ');

  return `
CREATE OR REPLACE FUNCTION public.fn_replicar_${tabela}()
RETURNS TRIGGER AS $$
DECLARE
    v_log_id INTEGER;
    v_now TIMESTAMP WITH TIME ZONE := CURRENT_TIMESTAMP;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        DELETE FROM replica_remote.${tabela} WHERE id = NEW.id;
        INSERT INTO replica_remote.${tabela} (${colsList})
        VALUES (${newColsList});

        INSERT INTO public.log_replicacao (tabela, operacao, registro_id, origem_db, destino_db, dados_antigos, dados_novos, replicado_em)
        VALUES ('${tabela}', 'INSERT', NEW.id, '${primaryDb}', '${replicaDb}', NULL, to_jsonb(NEW), v_now)
        RETURNING id INTO v_log_id;

        INSERT INTO replica_remote.log_replicacao (id, tabela, operacao, registro_id, origem_db, destino_db, dados_antigos, dados_novos, replicado_em)
        VALUES (v_log_id, '${tabela}', 'INSERT', NEW.id, '${primaryDb}', '${replicaDb}', NULL, to_jsonb(NEW), v_now);

        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE replica_remote.${tabela}
        SET ${updateSetList}
        WHERE id = NEW.id;

        IF NOT FOUND THEN
            INSERT INTO replica_remote.${tabela} (${colsList})
            VALUES (${newColsList});
        END IF;

        INSERT INTO public.log_replicacao (tabela, operacao, registro_id, origem_db, destino_db, dados_antigos, dados_novos, replicado_em)
        VALUES ('${tabela}', 'UPDATE', NEW.id, '${primaryDb}', '${replicaDb}', to_jsonb(OLD), to_jsonb(NEW), v_now)
        RETURNING id INTO v_log_id;

        INSERT INTO replica_remote.log_replicacao (id, tabela, operacao, registro_id, origem_db, destino_db, dados_antigos, dados_novos, replicado_em)
        VALUES (v_log_id, '${tabela}', 'UPDATE', NEW.id, '${primaryDb}', '${replicaDb}', to_jsonb(OLD), to_jsonb(NEW), v_now);

        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM replica_remote.${tabela}
        WHERE id = OLD.id;

        INSERT INTO public.log_replicacao (tabela, operacao, registro_id, origem_db, destino_db, dados_antigos, dados_novos, replicado_em)
        VALUES ('${tabela}', 'DELETE', OLD.id, '${primaryDb}', '${replicaDb}', to_jsonb(OLD), NULL, v_now)
        RETURNING id INTO v_log_id;

        INSERT INTO replica_remote.log_replicacao (id, tabela, operacao, registro_id, origem_db, destino_db, dados_antigos, dados_novos, replicado_em)
        VALUES (v_log_id, '${tabela}', 'DELETE', OLD.id, '${primaryDb}', '${replicaDb}', to_jsonb(OLD), NULL, v_now);

        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_replicar_${tabela} ON public.${tabela};
CREATE TRIGGER trg_replicar_${tabela}
AFTER INSERT OR UPDATE OR DELETE ON public.${tabela}
FOR EACH ROW EXECUTE FUNCTION public.fn_replicar_${tabela}();
`;
}

async function configurarReplicacao() {
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
  const port = Number(DB_PORT) || 5432;
  const replicaDb = sequelize.replicaDatabaseName;

  // 1. Conectar ao banco administrativo `postgres` para garantir que o banco replica exista
  const adminSeq = new Sequelize('postgres', DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port,
    dialect: 'postgres',
    logging: false
  });

  try {
    const [dbs] = await adminSeq.query(
      `SELECT 1 FROM pg_database WHERE datname = :replicaDb`,
      { replacements: { replicaDb } }
    );

    if (dbs.length === 0) {
      await adminSeq.query(`CREATE DATABASE "${replicaDb}"`);
      console.log(`[Replicacao] Banco de dados replica "${replicaDb}" criado com sucesso.`);
    }
  } finally {
    await adminSeq.close();
  }

  // 2. Garantir estrutura de tabelas e tipos no banco replica
  const replicaSeq = sequelize.replica;
  const [tabelasReplica] = await replicaSeq.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'usuarios'`
  );

  if (tabelasReplica.length === 0) {
    const sqlPath = path.join(__dirname, '..', 'banco.sql');
    const bancoSql = fs.readFileSync(sqlPath, 'utf8');
    await replicaSeq.query(bancoSql);
    console.log(`[Replicacao] Schema inicial aplicado no banco "${replicaDb}".`);
  }

  // Garantir view vw_clientes_ordens_pecas na replica tambem
  await replicaSeq.query(`
    CREATE OR REPLACE VIEW public.vw_clientes_ordens_pecas AS
    SELECT c.id AS id_cliente,
        c.nome AS cliente,
        c.telefone,
        c.cidade,
        c.estado,
        o.id AS id_os,
        o.eletrodomestico,
        o.descricao_problema,
        o.status,
        o.aberta_em,
        o.data_agendada,
        t.nome AS tecnico,
        s.nome AS servico,
        p.id AS id_peca,
        p.nome AS peca,
        op.quantidade,
        op.preco_unitario,
        ((op.quantidade)::numeric * op.preco_unitario) AS valor_pecas,
        ((op.quantidade)::numeric * p.preco_custo) AS custo_aquisicao_pecas
    FROM clientes c
      LEFT JOIN os o ON o.id_cliente = c.id
      LEFT JOIN os_pecas op ON op.id_os = o.id
      LEFT JOIN pecas p ON p.id = op.id_peca
      LEFT JOIN tecnicos t ON t.id = o.id_tecnico
      LEFT JOIN servicos s ON s.id = o.id_servico;
  `);

  // 3. Criar tabela de auditoria `log_replicacao` no Primary e na Replica
  const ddlLog = `
    CREATE TABLE IF NOT EXISTS public.log_replicacao (
      id SERIAL PRIMARY KEY,
      tabela VARCHAR(100) NOT NULL,
      operacao VARCHAR(20) NOT NULL,
      registro_id INTEGER,
      origem_db VARCHAR(100) NOT NULL DEFAULT '${DB_NAME}',
      destino_db VARCHAR(100) NOT NULL DEFAULT '${replicaDb}',
      dados_antigos JSONB,
      dados_novos JSONB,
      replicado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sequelize.query(ddlLog);
  await replicaSeq.query(ddlLog);

  // 4. Configurar postgres_fdw no banco principal (`projeto_refri`)
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS postgres_fdw;`);
  await sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_foreign_server WHERE srvname = 'servidor_replica') THEN
        CREATE SERVER servidor_replica
          FOREIGN DATA WRAPPER postgres_fdw
          OPTIONS (host '${DB_HOST}', port '${port}', dbname '${replicaDb}');
      ELSE
        ALTER SERVER servidor_replica
          OPTIONS (SET host '${DB_HOST}', SET port '${port}', SET dbname '${replicaDb}');
      END IF;
    END $$;
  `);

  await sequelize.query(`
    CREATE USER MAPPING IF NOT EXISTS FOR CURRENT_USER
      SERVER servidor_replica
      OPTIONS (user '${DB_USER}', password '${DB_PASSWORD}');
  `);

  await sequelize.query(`DROP SCHEMA IF EXISTS replica_remote CASCADE;`);
  await sequelize.query(`CREATE SCHEMA replica_remote;`);
  await sequelize.query(`
    IMPORT FOREIGN SCHEMA public
      FROM SERVER servidor_replica
      INTO replica_remote;
  `);

  // 5. Criar Funcoes e Triggers de Replicacao em tempo real para todas as 10 tabelas
  for (const item of TABELAS_ORDENADAS) {
    const triggerSql = gerarFuncaoETriggerSQL(item.nome, item.colunas, DB_NAME, replicaDb);
    await sequelize.query(triggerSql);
  }

  // 6. Sincronizar a carga inicial de dados (Initial Seed Sync)
  await sincronizarDadosExistentes();

  return {
    primaryDatabase: DB_NAME,
    replicaDatabase: replicaDb,
    tabelasMonitoradas: TABELAS_ORDENADAS.map((t) => t.nome)
  };
}

async function sincronizarDadosExistentes() {
  const { DB_NAME } = process.env;
  const replicaDb = sequelize.replicaDatabaseName;
  const resumo = [];

  for (const item of TABELAS_ORDENADAS) {
    const colsList = item.colunas.join(', ');
    const pColsList = item.colunas.map((c) => `p.${c}`).join(', ');

    // Busca registros que existem no Primary mas ainda nao estao na Replica
    const [faltantes] = await sequelize.query(`
      SELECT ${pColsList}
      FROM public.${item.nome} p
      LEFT JOIN replica_remote.${item.nome} r ON r.id = p.id
      WHERE r.id IS NULL
      ORDER BY p.id ASC;
    `);

    if (faltantes.length > 0) {
      await sequelize.query(`
        INSERT INTO replica_remote.${item.nome} (${colsList})
        SELECT ${pColsList}
        FROM public.${item.nome} p
        LEFT JOIN replica_remote.${item.nome} r ON r.id = p.id
        WHERE r.id IS NULL
        ORDER BY p.id ASC;
      `);

      // Registra log de carga inicial
      for (const row of faltantes) {
        await sequelize.query(
          `INSERT INTO public.log_replicacao (tabela, operacao, registro_id, origem_db, destino_db, dados_novos)
           VALUES (:tabela, 'SYNC_INICIAL', :id, :origem, :destino, :dados::jsonb)`,
          {
            replacements: {
              tabela: item.nome,
              id: row.id,
              origem: DB_NAME,
              destino: replicaDb,
              dados: JSON.stringify(row)
            }
          }
        );
        await sequelize.replica.query(
          `INSERT INTO public.log_replicacao (tabela, operacao, registro_id, origem_db, destino_db, dados_novos)
           VALUES (:tabela, 'SYNC_INICIAL', :id, :origem, :destino, :dados::jsonb)`,
          {
            replacements: {
              tabela: item.nome,
              id: row.id,
              origem: DB_NAME,
              destino: replicaDb,
              dados: JSON.stringify(row)
            }
          }
        );
      }
    }

    // Ajustar sequence do ID na replica
    await sequelize.replica.query(`
      SELECT setval(
        pg_get_serial_sequence('public.${item.nome}', 'id'),
        COALESCE((SELECT MAX(id) FROM public.${item.nome}), 1),
        (SELECT COUNT(*) > 0 FROM public.${item.nome})
      );
    `);

    const [[countPrimary]] = await sequelize.query(`SELECT COUNT(*)::int AS total FROM public.${item.nome}`);
    const [[countReplica]] = await sequelize.replica.query(`SELECT COUNT(*)::int AS total FROM public.${item.nome}`);

    resumo.push({
      tabela: item.nome,
      inseridos_na_sincronizacao: faltantes.length,
      total_principal: countPrimary.total,
      total_replica: countReplica.total,
      sincronizado: countPrimary.total === countReplica.total
    });
  }

  return resumo;
}

async function obterStatusReplicacao() {
  const { DB_NAME } = process.env;
  const replicaDb = sequelize.replicaDatabaseName;

  const comparativoTabelas = [];
  let todasSincronizadas = true;

  for (const item of TABELAS_ORDENADAS) {
    const [[pCount]] = await sequelize.query(`SELECT COUNT(*)::int AS total FROM public.${item.nome}`);
    const [[rCount]] = await sequelize.replica.query(`SELECT COUNT(*)::int AS total FROM public.${item.nome}`);
    const emSincronia = pCount.total === rCount.total;
    if (!emSincronia) todasSincronizadas = false;

    comparativoTabelas.push({
      tabela: item.nome,
      registros_banco_principal: pCount.total,
      registros_banco_replica: rCount.total,
      em_sincronia: emSincronia
    });
  }

  const [triggers] = await sequelize.query(`
    SELECT trigger_name, event_object_table AS tabela, string_agg(event_manipulation, ', ' ORDER BY event_manipulation) AS eventos
    FROM information_schema.triggers
    WHERE trigger_schema = 'public' AND trigger_name LIKE 'trg_replicar_%'
    GROUP BY trigger_name, event_object_table
    ORDER BY event_object_table;
  `);

  const [ultimosLogs] = await sequelize.replica.query(`
    SELECT id, tabela, operacao, registro_id, origem_db, destino_db, replicado_em
    FROM public.log_replicacao
    ORDER BY id DESC
    LIMIT 15;
  `);

  return {
    arquitetura: 'PostgreSQL Primary-Replica via Foreign Data Wrapper (postgres_fdw) + Triggers PL/pgSQL em Tempo Real',
    banco_principal: DB_NAME,
    banco_replica: replicaDb,
    todas_tabelas_sincronizadas: todasSincronizadas,
    total_triggers_ativas: triggers.length,
    comparativo_tabelas: comparativoTabelas,
    triggers_ativas: triggers,
    ultimos_eventos_replicados: ultimosLogs
  };
}

module.exports = {
  TABELAS_ORDENADAS,
  configurarReplicacao,
  sincronizarDadosExistentes,
  obterStatusReplicacao
};
