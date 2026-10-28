const User = require('../models/userModel');

module.exports = {
  async index(req, res) {
    try {
      const data = await User.findAll({ attributes: { exclude: ['senha_hash'] } });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuarios', details: error.message });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const data = await User.findByPk(id, { attributes: { exclude: ['senha_hash'] } });
      if (!data) return res.status(404).json({ error: 'Usuario nao encontrado' });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuario', details: error.message });
    }
  },

  async store(req, res) {
    try {
      const data = await User.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar usuario', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });

      await user.update({ ...req.body, atualizado_em: new Date() });
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar usuario', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });

      await user.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar usuario', details: error.message });
    }
  }
};