const { Op } = require('sequelize');
const OS = require('../models/OSModel');
const OsPeca = require('../models/OsPecaModel');
const Servico = require('../models/servicoModel');
const Cliente = require('../models/clienteModel');
const Tecnico = require('../models/tecnicoModel');
const { aplicarFiltroCliente, pertenceAoCliente } = require('../utils/escopoCliente');

const statusValidos = ['aberta', 'agendada', 'em_andamento', 'concluida', 'cancelada'];
const statusFinais = ['concluida', 'cancelada'];

const arredondar = (n) => Number(Number(n).toFixed(2));

// Soma (quantidade x preco_unitario) das peças registradas em os_pecas, por OS
async function somarPecas(idsOs) {
  if (!idsOs.length) return {};
  const itens = await OsPeca.findAll({ where: { id_os: { [Op.in]: idsOs } }, raw: true });
  const mapa = {};
  for (const item of itens) {
    mapa[item.id_os] = (mapa[item.id_os] || 0) + Number(item.preco_unitario) * Number(item.quantidade);
  }
  return mapa;
}

function montarResumo(os, valorPecas = 0) {
  const valorServico = Number(os.servico?.valor || 0);
  return {
    valor_servico: arredondar(valorServico),
    valor_pecas: arredondar(valorPecas),
    valor_total: arredondar(valorServico + valorPecas)
  };
}

const includes = [
  { model: Cliente, attributes: ['id', 'nome'] },
  { model: Tecnico, attributes: ['id', 'nome'] },
  { model: Servico, attributes: ['id', 'nome', 'valor'], required: false }
];

module.exports = {
  async criar(req, res) {
    try {
      const { id_cliente, id_tecnico, eletrodomestico, descricao_problema, data_agendada = null, id_servico = null } = req.body;
      if (!id_cliente || !id_tecnico || !eletrodomestico || !descricao_problema) {
        return res.status(400).json({ mensagem: 'Informe id_cliente, id_tecnico, eletrodomestico e descricao_problema.' });
      }

      let data = null;
      if (data_agendada) {
        data = new Date(data_agendada);
        if (Number.isNaN(data.getTime())) {
          return res.status(400).json({ mensagem: 'data_agendada invalida.' });
        }
      }

      const os = await OS.create({
        id_cliente, id_tecnico, eletrodomestico, descricao_problema,
        data_agendada: data, id_servico,
        status: data ? 'agendada' : 'aberta',
        aberta_em: new Date()
      });
      return res.status(201).json(os);
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({ mensagem: 'Cliente, tecnico ou servico informado nao existe.' });
      }
      return res.status(400).json({ mensagem: 'Erro ao criar ordem de servico.', detalhe: error.message });
    }
  },

  async listar(req, res) {
    try {
      const where = {};
      if (req.query.status) where.status = req.query.status;
      if (req.query.id_cliente) where.id_cliente = req.query.id_cliente;
      if (req.query.id_tecnico) where.id_tecnico = req.query.id_tecnico;

      const ordens = await OS.findAll({ where: aplicarFiltroCliente(req, where), include: includes, order: [['aberta_em', 'DESC']] });
      const pecasPorOs = await somarPecas(ordens.map((o) => o.id));

      const resultado = ordens.map((item) => {
        const os = item.toJSON();
        return { ...os, ...montarResumo(os, pecasPorOs[os.id] || 0) };
      });
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao listar ordens de servico.', detalhe: error.message });
    }
  },

  async buscar(req, res) {
    try {
      const item = await OS.findByPk(req.params.id, { include: includes });
      if (!item || !pertenceAoCliente(req, item.id_cliente)) {
        return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      }

      const os = item.toJSON();
      const pecasPorOs = await somarPecas([os.id]);
      return res.json({ ...os, ...montarResumo(os, pecasPorOs[os.id] || 0) });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar ordem de servico.', detalhe: error.message });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body;
      if (!statusValidos.includes(status)) {
        return res.status(400).json({ mensagem: `Status invalido. Use: ${statusValidos.join(', ')}.` });
      }
      const os = await OS.findByPk(req.params.id);
      if (!os) return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });

      if (statusFinais.includes(os.status) && status !== os.status) {
        return res.status(409).json({ mensagem: `OS ${os.status} nao pode mudar de status.` });
      }

      os.status = status;
      os.atualizada_em = new Date();
      await os.save();
      return res.json(os);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao atualizar status.', detalhe: error.message });
    }
  },

  async atualizarData(req, res) {
    try {
      const { data_agendada } = req.body;
      const data = new Date(data_agendada);
      if (!data_agendada || Number.isNaN(data.getTime())) {
        return res.status(400).json({ mensagem: 'Informe uma data_agendada valida.' });
      }
      const os = await OS.findByPk(req.params.id);
      if (!os) return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      if (statusFinais.includes(os.status)) {
        return res.status(409).json({ mensagem: 'Nao e possivel reagendar uma OS cancelada ou concluida.' });
      }

      os.data_agendada = data;
      if (os.status === 'aberta') os.status = 'agendada';
      os.atualizada_em = new Date();
      await os.save();
      return res.json(os);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao atualizar data.', detalhe: error.message });
    }
  },

  async calcularTotal(req, res) {
    try {
      const item = await OS.findByPk(req.params.id, { include: [{ model: Servico, required: false }] });
      if (!item || !pertenceAoCliente(req, item.id_cliente)) {
        return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      }

      const pecasPorOs = await somarPecas([item.id]);
      return res.json({ id_os: item.id, ...montarResumo(item, pecasPorOs[item.id] || 0) });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao calcular total da OS.', detalhe: error.message });
    }
  }
};