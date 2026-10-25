const Tecnico = require('../models/tecnicoModel');

module.exports = {
  async index(req, res) {
    try {
      const data = await Tecnico.findAll();
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar tecnicos', details: error.message });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const data = await Tecnico.findByPk(id);
      if (!data) return res.status(404).json({ error: 'Tecnico nao encontrado' });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar tecnico', details: error.message });
    }
  },

  async store(req, res) {
    try {
      const data = await Tecnico.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar tecnico', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const tecnico = await Tecnico.findByPk(id);
      if (!tecnico) return res.status(404).json({ error: 'Tecnico nao encontrado' });

      await tecnico.update(req.body);
      return res.json(tecnico);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar tecnico', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const tecnico = await Tecnico.findByPk(id);
      if (!tecnico) return res.status(404).json({ error: 'Tecnico nao encontrado' });

      await tecnico.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar tecnico', details: error.message });
    }
  }
};