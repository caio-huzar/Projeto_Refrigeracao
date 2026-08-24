const Servico = require('../models/servicoModel');

module.exports = {
  async index(req, res) {
    try {
      const data = await Servico.findAll();
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar serviços', details: error.message });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const data = await Servico.findByPk(id);
      if (!data) return res.status(404).json({ error: 'Serviço não encontrado' });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar serviço', details: error.message });
    }
  },

  async store(req, res) {
    try {
      const data = await Servico.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar serviço', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const servico = await Servico.findByPk(id);
      if (!servico) return res.status(404).json({ error: 'Serviço não encontrado' });

      await servico.update(req.body);
      return res.json(servico);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar serviço', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const servico = await Servico.findByPk(id);
      if (!servico) return res.status(404).json({ error: 'Serviço não encontrado' });

      await servico.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar serviço', details: error.message });
    }
  }
};