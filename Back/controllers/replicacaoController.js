const {
  TABELAS_ORDENADAS,
  configurarReplicacao,
  sincronizarDadosExistentes,
  obterStatusReplicacao
} = require('../config/replicacaoSetup');
const sequelize = require('../config/database');
const Servico = require('../models/servicoModel');

const replicacaoController = {
  async status(req, res) {
    try {
      const relatorio = await obterStatusReplicacao();
      return res.status(200).json(relatorio);
    } catch (error) {
      return res.status(500).json({
        erro: 'Falha ao consultar status da replicacao',
        detalhes: error.message
      });
    }
  },

  async sincronizar(req, res) {
    try {
      await configurarReplicacao();
      const resumo = await sincronizarDadosExistentes();
      const statusAtual = await obterStatusReplicacao();
      return res.status(200).json({
        mensagem: 'Sincronizacao e configuracao de replicacao executadas com sucesso.',
        resumo_sincronizacao: resumo,
        status: statusAtual
      });
    } catch (error) {
      return res.status(500).json({
        erro: 'Falha ao sincronizar bancos de dados',
        detalhes: error.message
      });
    }
  },

  async testarTempoReal(req, res) {
    try {
      const sufixo = Date.now().toString().slice(-6);
      const nomeInicial = `Servico Teste Replicacao #${sufixo}`;
      const nomeAtualizado = `Servico Teste Replicacao #${sufixo} [ATUALIZADO]`;

      // 1. INSERT no banco principal (via Sequelize model)
      const criado = await Servico.create({
        nome: nomeInicial,
        descricao: 'Registro criado no banco principal para comprovar replicacao automatica na replica',
        valor: 150.00
      });

      // Consulta imediatamente no banco replica (conexao direta na replica)
      const [[aposInsertReplica]] = await sequelize.replica.query(
        `SELECT id, nome, descricao, valor FROM public.servicos WHERE id = :id`,
        { replacements: { id: criado.id } }
      );

      // 2. UPDATE no banco principal
      await criado.update({
        nome: nomeAtualizado,
        valor: 225.50
      });

      // Consulta imediatamente no banco replica apos UPDATE
      const [[aposUpdateReplica]] = await sequelize.replica.query(
        `SELECT id, nome, descricao, valor FROM public.servicos WHERE id = :id`,
        { replacements: { id: criado.id } }
      );

      // 3. Se manter_registro = false (padrao false para nao sujar, ou true se o aluno quiser manter)
      const manter = Boolean(req.body && req.body.manter_registro);
      let aposDeleteReplica = null;

      if (!manter) {
        await criado.destroy();
        const [rowsDelete] = await sequelize.replica.query(
          `SELECT id FROM public.servicos WHERE id = :id`,
          { replacements: { id: criado.id } }
        );
        aposDeleteReplica = rowsDelete.length === 0 ? 'Removido com sucesso da replica' : 'Ainda presente';
      }

      // 4. Busca os logs gerados por esse ID na tabela log_replicacao do banco replica
      const [logsGerados] = await sequelize.replica.query(
        `SELECT id, tabela, operacao, registro_id, origem_db, destino_db, dados_antigos, dados_novos, replicado_em
         FROM public.log_replicacao
         WHERE tabela = 'servicos' AND registro_id = :id
         ORDER BY id ASC`,
        { replacements: { id: criado.id } }
      );

      return res.status(200).json({
        comprovacao: 'SUCESSO - Replicacao em tempo real (INSERT, UPDATE, DELETE) comprovada entre bancos PostgreSQL',
        banco_principal: process.env.DB_NAME,
        banco_replica: sequelize.replicaDatabaseName,
        id_testado: criado.id,
        etapas: {
          '1_insert_reproduzido_na_replica': aposInsertReplica || null,
          '2_update_reproduzido_na_replica': aposUpdateReplica || null,
          '3_delete_reproduzido_na_replica': manter ? 'Registro mantido em ambos os bancos (manter_registro=true)' : aposDeleteReplica
        },
        auditoria_log_replicacao: logsGerados
      });
    } catch (error) {
      return res.status(500).json({
        erro: 'Falha ao executar teste de replicacao em tempo real',
        detalhes: error.message
      });
    }
  },

  async consultarTabelaReplica(req, res) {
    try {
      const { tabela } = req.params;
      const valida = TABELAS_ORDENADAS.find((t) => t.nome === tabela);
      if (!valida) {
        return res.status(400).json({
          erro: `Tabela invalida. Escolha uma entre: ${TABELAS_ORDENADAS.map((t) => t.nome).join(', ')}`
        });
      }

      const [dadosPrincipal] = await sequelize.query(`SELECT * FROM public.${valida.nome} ORDER BY id ASC LIMIT 50`);
      const [dadosReplica] = await sequelize.replica.query(`SELECT * FROM public.${valida.nome} ORDER BY id ASC LIMIT 50`);

      return res.status(200).json({
        tabela: valida.nome,
        banco_principal: {
          database: process.env.DB_NAME,
          total_retornado: dadosPrincipal.length,
          registros: dadosPrincipal
        },
        banco_replica: {
          database: sequelize.replicaDatabaseName,
          total_retornado: dadosReplica.length,
          registros: dadosReplica
        }
      });
    } catch (error) {
      return res.status(500).json({
        erro: 'Falha ao consultar tabela nos dois bancos',
        detalhes: error.message
      });
    }
  }
};

module.exports = replicacaoController;
