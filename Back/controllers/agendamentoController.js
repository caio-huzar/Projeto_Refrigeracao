const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Agendamento = require('../models/AgendamentoModel');
const Horario = require('../models/HorarioDisponivelModel');
const Tecnico = require('../models/tecnicoModel');
const { aplicarFiltroCliente } = require('../utils/escopoCliente');

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

module.exports = {
  async criar(req, res) {
    try {
      let { id_cliente, id_tecnico, data_hora, observacao = null } = req.body;
      if (req.usuario.cargo === 'cliente') id_cliente = req.usuario.id_cliente;
      const data = parseDate(data_hora);
      if (!id_cliente || !id_tecnico || !data) {
        return res.status(400).json({ mensagem: 'Informe id_cliente, id_tecnico e uma data_hora valida.' });
      }
      if (data <= new Date()) return res.status(400).json({ mensagem: 'O agendamento deve ser no futuro.' });

      const tecnico = await Tecnico.findByPk(id_tecnico);
      if (!tecnico || tecnico.esta_ativo === false) {
        return res.status(400).json({ mensagem: 'Tecnico nao encontrado ou inativo.' });
      }

      const diaSemana = data.getDay();
      const hora = data.toTimeString().slice(0, 8);
      const regras = await Horario.findAll({
        where: {
          id_tecnico, dia_semana: diaSemana, esta_ativo: true,
          hora_inicio: { [Op.lte]: hora },
          hora_fim: { [Op.gt]: hora }
        }
      });
      if (!regras.length) return res.status(409).json({ mensagem: 'O tecnico nao possui horario disponivel nesse dia e horario.' });

      const conflito = await Agendamento.findOne({
        where: {
          id_tecnico,
          status: { [Op.in]: ['pendente', 'confirmado'] },
          data_hora: { [Op.between]: [new Date(data.getTime() - 59 * 60000), new Date(data.getTime() + 59 * 60000)] }
        }
      });
      if (conflito) return res.status(409).json({ mensagem: 'Ja existe um agendamento proximo desse horario para o tecnico.' });

      const agendamento = await Agendamento.create({ id_cliente, id_tecnico, data_hora: data, observacao });
      return res.status(201).json(agendamento);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao criar agendamento.', detalhe: error.message });
    }
  },

  async confirmar(req, res) {
    try {
      const agendamento = await Agendamento.findByPk(req.params.id);
      if (!agendamento) return res.status(404).json({ mensagem: 'Agendamento nao encontrado.' });
      if (agendamento.status === 'cancelado') return res.status(409).json({ mensagem: 'Nao e possivel confirmar um agendamento cancelado.' });
      agendamento.status = 'confirmado';
      agendamento.atualizado_em = new Date();
      await agendamento.save();
      return res.json(agendamento);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao confirmar agendamento.', detalhe: error.message });
    }
  },

  async cancelar(req, res) {
    try {
      const agendamento = await Agendamento.findByPk(req.params.id);
      if (!agendamento) return res.status(404).json({ mensagem: 'Agendamento nao encontrado.' });
      if (agendamento.status === 'cancelado') return res.status(409).json({ mensagem: 'Agendamento ja esta cancelado.' });
      agendamento.status = 'cancelado';
      agendamento.atualizado_em = new Date();
      await agendamento.save();
      return res.json(agendamento);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao cancelar agendamento.', detalhe: error.message });
    }
  },

  async listar(req, res) {
    try {
      const where = {};
      if (req.query.id_cliente) where.id_cliente = req.query.id_cliente;
      if (req.query.id_tecnico) where.id_tecnico = req.query.id_tecnico;
      if (req.query.status) where.status = req.query.status;
      const dados = await Agendamento.findAll({ where: aplicarFiltroCliente(req, where), order: [['data_hora', 'ASC']] });
      return res.json(dados);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao listar agendamentos.', detalhe: error.message });
    }
  }
};
