const User = require('../models/userModel');

module.exports = {
  // Read (Listar Todos)
  async index(req, res) {
    try {
      const data = await User.findAll();
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
  },

  // Read (Buscar por ID)
  async show(req, res) {
    try {
      const { id } = req.params;
      const data = await User.findByPk(id);
      if (!data) return res.status(404).json({ error: 'Usuário não encontrado' });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
  },

  // Create
  async store(req, res) {
    try {
      const data = await User.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar usuário', details: error.message });
    }
  },

  // Update
  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      await user.update({ ...req.body, atualizado_em: new Date() });
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
  },

  // Delete
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      await user.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
  }
};