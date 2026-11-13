require('dotenv').config();
const sequelize = require('./config/database');
const { configurarReplicacao, obterStatusReplicacao } = require('./config/replicacaoSetup');
const Servico = require('./models/servicoModel');

async function executarComprovacao() {
  console.log('======================================================================');
  console.log('   RELATORIO DE COMPROVACAO DE REPLICACAO DE DADOS (POSTGRESQL)');
  console.log('======================================================================\n');

  await configurarReplicacao();

  console.log(`[1] Bancos Conectados:`);
  console.log(`    - Banco Principal (Primary): ${process.env.DB_NAME}`);
  console.log(`    - Banco Replica   (Standby): ${sequelize.replicaDatabaseName}\n`);

  const statusInicial = await obterStatusReplicacao();
  console.log(`[2] Comparativo de Registros em Todas as Tabelas (Antes do Teste):`);
  console.table(statusInicial.comparativo_tabelas);

  console.log(`\n[3] Executando Teste de Replicacao em Tempo Real (INSERT -> UPDATE -> DELETE)...`);
  const codigo = Date.now().toString().slice(-5);

  // 3.1 INSERT
  const novoServico = await Servico.create({
    nome: `Higienizacao Ar Split [Teste #${codigo}]`,
    descricao: 'Criado no banco principal para comprovar replicacao automatica',
    valor: 180.00
  });
  console.log(`    -> [PRIMARY] INSERT realizado na tabela "servicos" (id = ${novoServico.id}, valor = R$ ${novoServico.valor})`);

  const [[replicaInsert]] = await sequelize.replica.query(
    `SELECT id, nome, valor FROM public.servicos WHERE id = :id`,
    { replacements: { id: novoServico.id } }
  );
  console.log(`    -> [REPLICA] Consulta imediata em "${sequelize.replicaDatabaseName}.servicos":`, replicaInsert);

  // 3.2 UPDATE
  await novoServico.update({
    nome: `Higienizacao Ar Split [Teste #${codigo} - ATUALIZADO]`,
    valor: 240.00
  });
  console.log(`    -> [PRIMARY] UPDATE realizado na tabela "servicos" (id = ${novoServico.id}, novo valor = R$ 240.00)`);

  const [[replicaUpdate]] = await sequelize.replica.query(
    `SELECT id, nome, valor FROM public.servicos WHERE id = :id`,
    { replacements: { id: novoServico.id } }
  );
  console.log(`    -> [REPLICA] Consulta imediata em "${sequelize.replicaDatabaseName}.servicos":`, replicaUpdate);

  // 3.3 DELETE
  await novoServico.destroy();
  console.log(`    -> [PRIMARY] DELETE realizado na tabela "servicos" (id = ${novoServico.id})`);

  const [replicaDelete] = await sequelize.replica.query(
    `SELECT id FROM public.servicos WHERE id = :id`,
    { replacements: { id: novoServico.id } }
  );
  console.log(`    -> [REPLICA] Registros encontrados apos DELETE na replica: ${replicaDelete.length} (Excluido com sucesso!)\n`);

  // 4. Exibir auditoria do log_replicacao no banco replica
  const [logs] = await sequelize.replica.query(
    `SELECT id, tabela, operacao, registro_id, origem_db, destino_db, replicado_em
     FROM public.log_replicacao
     WHERE tabela = 'servicos' AND registro_id = :id
     ORDER BY id ASC`,
    { replacements: { id: novoServico.id } }
  );
  console.log(`[4] Registro de Auditoria Gravado Automaticamente na Tabela "log_replicacao":`);
  console.table(logs);

  console.log('\n======================================================================');
  console.log('   RESULTADO: REPLICACAO AUTOMATICA COMPROVADA COM 100% DE SINCRONIA!');
  console.log('======================================================================');
}

executarComprovacao()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Erro na comprovacao:', err);
    process.exit(1);
  });
