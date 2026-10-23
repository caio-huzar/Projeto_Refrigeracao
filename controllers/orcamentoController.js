const Orcamento = require('../models/orcamentoModel');
const OS = require('../models/OSModel');
const OsPeca = require('../models/OsPecaModel');
const Servico = require('../models/servicoModel');

const statusValidos = ['rascunho', 'enviado', 'aprovado', 'recusado', 'cancelado'];
const transicoes = {
  rascunho: ['enviado', 'cancelado'],
  enviado: ['aprovado', 'recusado', 'cancelado'],
  aprovado: [],
  recusado: [],
  cancelado: []
};

function validarId(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

async function calcularTotalOS(os) {
  const pecas = await OsPeca.findAll({
    where: { id_os: os.id },
    attributes: ['quantidade', 'preco_unitario'],
    raw: true
  });
  const valorServico = Number(os.servico?.valor || 0);
  const valorPecas = pecas.reduce(
    (total, peca) => total + Number(peca.quantidade) * Number(peca.preco_unitario),
    0
  );
  return (Math.round((valorServico + valorPecas + Number.EPSILON) * 100) / 100).toFixed(2);
}

module.exports = {
  async criar(req, res) {
    try {
      const { id_os, validade = null } = req.body;
      if (!validarId(id_os)) {
        return res.status(400).json({ mensagem: 'Informe um id_os valido.' });
      }
      if (validade && !/^\d{4}-\d{2}-\d{2}$/.test(validade)) {
        return res.status(400).json({ mensagem: 'A validade deve estar no formato AAAA-MM-DD.' });
      }

      const os = await OS.findByPk(id_os, {
        include: [{ model: Servico, required: false }]
      });
      if (!os) return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });

      const valor = await calcularTotalOS(os);
      const orcamento = await Orcamento.create({ id_os, valor, validade });
      return res.status(201).json(orcamento);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao criar orcamento.', detalhe: error.message });
    }
  },

  async listar(req, res) {
    try {
      const where = {};
      if (req.query.id_os) {
        if (!validarId(req.query.id_os)) {
          return res.status(400).json({ mensagem: 'id_os invalido.' });
        }
        where.id_os = Number(req.query.id_os);
      }
      if (req.query.status) {
        if (!statusValidos.includes(req.query.status)) {
          return res.status(400).json({ mensagem: 'Status de orcamento invalido.' });
        }
        where.status = req.query.status;
      }

      const orcamentos = await Orcamento.findAll({
        where,
        order: [['criado_em', 'DESC']]
      });
      return res.json(orcamentos);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao listar orcamentos.', detalhe: error.message });
    }
  },

  async buscar(req, res) {
    try {
      const orcamento = await Orcamento.findByPk(req.params.id, {
        include: [{ model: OS, as: 'os' }]
      });
      if (!orcamento) return res.status(404).json({ mensagem: 'Orcamento nao encontrado.' });
      return res.json(orcamento);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar orcamento.', detalhe: error.message });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body;
      if (!statusValidos.includes(status)) {
        return res.status(400).json({ mensagem: `Status invalido. Use: ${statusValidos.join(', ')}.` });
      }

      const orcamento = await Orcamento.findByPk(req.params.id);
      if (!orcamento) return res.status(404).json({ mensagem: 'Orcamento nao encontrado.' });
      if (!transicoes[orcamento.status].includes(status)) {
        return res.status(409).json({ mensagem: `Nao e permitido alterar de ${orcamento.status} para ${status}.` });
      }

      orcamento.status = status;
      orcamento.atualizado_em = new Date();
      await orcamento.save();
      return res.json(orcamento);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao atualizar status do orcamento.', detalhe: error.message });
    }
  }
};