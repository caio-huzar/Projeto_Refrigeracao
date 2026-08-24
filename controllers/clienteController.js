const Cliente = require('../models/clienteModel');
const User = require('../models/userModel');

module.exports = {
  async index(req, res) {
    try {
      const data = await Cliente.findAll({ include: { model: User, attributes: ['email', 'cargo', 'esta_ativo'] } });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar clientes', details: error.message });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const data = await Cliente.findByPk(id, { include: { model: User, attributes: ['email', 'cargo', 'esta_ativo'] } });
      if (!data) return res.status(404).json({ error: 'Cliente não encontrado' });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar cliente', details: error.message });
    }
  },

  async store(req, res) {
    try {
      const data = await Cliente.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar cliente', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id);
      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

      await cliente.update(req.body);
      return res.json(cliente);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar cliente', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id);
      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

      await cliente.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar cliente', details: error.message });
    }
  }
};