const OS = require('../models/OSModel');
const Cliente = require('../models/clienteModel');
const Tecnico = require('../models/tecnicoModel');
const Servico = require('../models/servicoModel');
const Peca = require('../models/pecaModel');

module.exports = {
  async index(req, res) {
    try {
      const data = await OS.findAll({
        include: [
          { model: Cliente },
          { model: Tecnico },
          { model: Servico },
          { model: Peca }
        ]
      });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar ordens de serviço', details: error.message });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const data = await OS.findByPk(id, {
        include: [
          { model: Cliente },
          { model: Tecnico },
          { model: Servico },
          { model: Peca }
        ]
      });
      if (!data) return res.status(404).json({ error: 'Ordem de Serviço não encontrada' });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar ordem de serviço', details: error.message });
    }
  },

  async store(req, res) {
    try {
      const data = await OS.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar ordem de serviço', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const os = await OS.findByPk(id);
      if (!os) return res.status(404).json({ error: 'Ordem de Serviço não encontrada' });

      await os.update({ ...req.body, atualizada_em: new Date() });
      return res.json(os);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar ordem de serviço', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const os = await OS.findByPk(id);
      if (!os) return res.status(404).json({ error: 'Ordem de Serviço não encontrada' });

      await os.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar ordem de serviço', details: error.message });
    }
  }
};