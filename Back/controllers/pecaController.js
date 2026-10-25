const Peca = require('../models/pecaModel');

module.exports = {
  async index(req, res) {
    try {
      const data = await Peca.findAll();
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pecas', details: error.message });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const data = await Peca.findByPk(id);
      if (!data) return res.status(404).json({ error: 'Peca nao encontrada' });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar peca', details: error.message });
    }
  },

  async store(req, res) {
    try {
      const data = await Peca.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar peca', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const peca = await Peca.findByPk(id);
      if (!peca) return res.status(404).json({ error: 'Peca nao encontrada' });

      await peca.update(req.body);
      return res.json(peca);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar peca', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const peca = await Peca.findByPk(id);
      if (!peca) return res.status(404).json({ error: 'Peca nao encontrada' });

      await peca.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar peca', details: error.message });
    }
  }
};