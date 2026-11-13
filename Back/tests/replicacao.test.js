const test = require('node:test');
const assert = require('node:assert/strict');
const sequelize = require('../config/database');
const { configurarReplicacao, obterStatusReplicacao } = require('../config/replicacaoSetup');
const Servico = require('../models/servicoModel');

test('replicacao entre banco principal (projeto_refri) e replica (projeto_refri_replica) replica INSERT, UPDATE e DELETE em tempo real', async () => {
  await configurarReplicacao();

  const statusInicial = await obterStatusReplicacao();
  assert.equal(statusInicial.todas_tabelas_sincronizadas, true);
  assert.equal(statusInicial.total_triggers_ativas, 10);

  // 1. INSERT no banco principal
  const servico = await Servico.create({
    nome: 'Teste Automatizado Replicacao',
    descricao: 'Verifica espelhamento automatico via postgres_fdw + trigger',
    valor: 199.90
  });

  const [[insertNaReplica]] = await sequelize.replica.query(
    `SELECT id, nome, valor FROM public.servicos WHERE id = :id`,
    { replacements: { id: servico.id } }
  );
  assert.ok(insertNaReplica, 'O registro inserido no banco principal deve existir imediatamente no banco replica');
  assert.equal(insertNaReplica.nome, 'Teste Automatizado Replicacao');
  assert.equal(Number(insertNaReplica.valor), 199.90);

  // 2. UPDATE no banco principal
  await servico.update({
    nome: 'Teste Automatizado Replicacao [Editado]',
    valor: 249.90
  });

  const [[updateNaReplica]] = await sequelize.replica.query(
    `SELECT id, nome, valor FROM public.servicos WHERE id = :id`,
    { replacements: { id: servico.id } }
  );
  assert.equal(updateNaReplica.nome, 'Teste Automatizado Replicacao [Editado]');
  assert.equal(Number(updateNaReplica.valor), 249.90);

  // 3. DELETE no banco principal
  await servico.destroy();

  const [deleteNaReplica] = await sequelize.replica.query(
    `SELECT id FROM public.servicos WHERE id = :id`,
    { replacements: { id: servico.id } }
  );
  assert.equal(deleteNaReplica.length, 0, 'O registro excluido no banco principal deve ser removido imediatamente da replica');

  await sequelize.replica.close();
  await sequelize.close();
});
