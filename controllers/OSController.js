const { Op } = require('sequelize');
const sequelize = require('../config/database');
const OS = require('../models/OSModel');
const Servico = require('../models/servicoModel');
const Cliente = require('../models/clienteModel');
const Tecnico = require('../models/tecnicoModel');

const statusValidos = ['aberta', 'agendada', 'em_andamento', 'concluida', 'cancelada'];

module.exports = {
  async criar(req, res) {
    try {
      const { id_cliente, id_tecnico, eletrodomestico, descricao_problema, data_agendada = null, id_servico = null } = req.body;
      if (!id_cliente || !id_tecnico || !eletrodomestico || !descricao_problema) {
        return res.status(400).json({ mensagem: 'Informe id_cliente, id_tecnico, eletrodomestico e descricao_problema.' });
      }
      const os = await OS.create({
        id_cliente, id_tecnico, eletrodomestico, descricao_problema,
        data_agendada, id_servico,
        status: data_agendada ? 'agendada' : 'aberta',
        aberta_em: new Date()
      });
      return res.status(201).json(os);
    } catch (error) {
      return res.status(400).json({ mensagem: 'Erro ao criar ordem de servico.', detalhe: error.message });
    }
  },

  async listar(req, res) {
    try {
      const where = {};
      if (req.query.status) where.status = req.query.status;
      if (req.query.id_cliente) where.id_cliente = req.query.id_cliente;
      if (req.query.id_tecnico) where.id_tecnico = req.query.id_tecnico;
      const ordens = await OS.findAll({
        where,
        include: [
          { model: Cliente, attributes: ['id', 'nome'] },
          { model: Tecnico, attributes: ['id', 'nome'] },
          { model: Servico, attributes: ['id', 'nome', 'valor'], required: false }
        ],
        order: [['aberta_em', 'DESC']]
      });
      const resultado = ordens.map(item => {
        const os = item.toJSON();
        os.valor_total = Number(os.servico?.valor || 0);
        return os;
      });
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao listar ordens de servico.', detalhe: error.message });
    }
  },

  async buscar(req, res) {
    try {
      const os = await OS.findByPk(req.params.id, {
        include: [
          { model: Cliente, attributes: ['id', 'nome'] },
          { model: Tecnico, attributes: ['id', 'nome'] },
          { model: Servico, attributes: ['id', 'nome', 'valor'], required: false }
        ]
      });
      if (!os) return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      const resultado = os.toJSON();
      resultado.valor_total = Number(resultado.servico?.valor || 0);
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar ordem de servico.', detalhe: error.message });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body;
      if (!statusValidos.includes(status)) return res.status(400).json({ mensagem: `Status invalido. Use: ${statusValidos.join(', ')}.` });
      const os = await OS.findByPk(req.params.id);
      if (!os) return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
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
      if (!data_agendada || Number.isNaN(data.getTime())) return res.status(400).json({ mensagem: 'Informe uma data_agendada valida.' });
      const os = await OS.findByPk(req.params.id);
      if (!os) return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      if (os.status === 'cancelada' || os.status === 'concluida') return res.status(409).json({ mensagem: 'Nao e possivel reagendar uma OS cancelada ou concluida.' });
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
      const os = await OS.findByPk(req.params.id, { include: [{ model: Servico, required: false }] });
      if (!os) return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      const valorServico = Number(os.servico?.valor || 0);
      let valorPecas = 0;
      if (os.id_peca && os.quantidade_pecas) {
        const Peca = require('../models/pecaModel');
        const peca = await Peca.findByPk(os.id_peca);
        if (peca) valorPecas = Number(peca.preco_venda) * Number(os.quantidade_pecas);
      }
      return res.json({ id_os: os.id, valor_servico: valorServico, valor_pecas: valorPecas, valor_total: Number((valorServico + valorPecas).toFixed(2)) });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao calcular total da OS.', detalhe: error.message });
    }
  }
};
