const sequelize = require('../config/database');
const Cliente = require('../models/clienteModel');
const User = require('../models/userModel');
const { gerarHashSenha } = require('../utils/senha');

module.exports = {
  async cadastrarComUsuario(req, res) {
    try {
      const { usuario, cliente } = req.body;
      const camposClienteObrigatorios = [
        'nome', 'telefone', 'cpf_cnpj', 'rua', 'numero_casa',
        'bairro', 'cep', 'cidade', 'estado'
      ];

      if (!usuario || !cliente || !usuario.email || !usuario.senha) {
        return res.status(400).json({ mensagem: 'Informe usuario.email, usuario.senha e os dados do cliente.' });
      }
      if (typeof usuario.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
        return res.status(400).json({ mensagem: 'Informe um email valido.' });
      }
      if (typeof usuario.senha !== 'string' || usuario.senha.length < 8) {
        return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 8 caracteres.' });
      }

      const camposFaltando = camposClienteObrigatorios.filter((campo) => cliente[campo] === undefined || cliente[campo] === null || cliente[campo] === '');
      if (camposFaltando.length) {
        return res.status(400).json({ mensagem: 'Dados obrigatorios do cliente ausentes.', campos: camposFaltando });
      }

      const numeroCasa = Number(cliente.numero_casa);
      if (!Number.isInteger(numeroCasa) || numeroCasa < 0) {
        return res.status(400).json({ mensagem: 'numero_casa deve ser um numero inteiro igual ou maior que zero.' });
      }

      const senha_hash = await gerarHashSenha(usuario.senha);
      const resultado = await sequelize.transaction(async (transaction) => {
        const novoUsuario = await User.create({
          email: usuario.email.trim().toLowerCase(),
          senha_hash,
          cargo: 'cliente'
        }, { transaction });

        const novoCliente = await Cliente.create({
          nome: cliente.nome,
          telefone: cliente.telefone,
          cpf_cnpj: cliente.cpf_cnpj,
          rua: cliente.rua,
          numero_casa: numeroCasa,
          bairro: cliente.bairro,
          cep: cliente.cep,
          cidade: cliente.cidade,
          estado: cliente.estado,
          id_usuario: novoUsuario.id
        }, { transaction });

        return { usuario: novoUsuario, cliente: novoCliente };
      });

      return res.status(201).json({
        usuario: {
          id: resultado.usuario.id,
          email: resultado.usuario.email,
          cargo: resultado.usuario.cargo,
          esta_ativo: resultado.usuario.esta_ativo
        },
        cliente: resultado.cliente
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ mensagem: 'Email, telefone ou CPF/CNPJ ja cadastrado.' });
      }
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ mensagem: 'Dados invalidos.', detalhe: error.message });
      }
      return res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.', detalhe: error.message });
    }
  },

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
      if (!data) return res.status(404).json({ error: 'Cliente nao encontrado' });
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
      if (!cliente) return res.status(404).json({ error: 'Cliente nao encontrado' });

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
      if (!cliente) return res.status(404).json({ error: 'Cliente nao encontrado' });

      await cliente.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar cliente', details: error.message });
    }
  }
};