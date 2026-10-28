const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Cliente = require('../models/clienteModel');
const { verificarSenha } = require('../utils/senha');

const JWT_ISSUER = 'refrigeracao-api';

module.exports = {
  async login(req, res) {
    try {
      const { email, senha } = req.body || {};
      if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
        return res.status(400).json({ mensagem: 'Informe email e senha.' });
      }

      const segredo = process.env.JWT_SECRET;
      if (!segredo || Buffer.byteLength(segredo) < 32) {
        return res.status(503).json({ mensagem: 'Autenticacao indisponivel: configure JWT_SECRET com pelo menos 32 caracteres.' });
      }

      const usuario = await User.findOne({
        where: { email: email.trim().toLowerCase() }
      });
      if (!usuario || !usuario.esta_ativo || !(await verificarSenha(senha, usuario.senha_hash))) {
        return res.status(401).json({ mensagem: 'Email ou senha invalidos.' });
      }

      let cliente = null;
      if (usuario.cargo === 'cliente') {
        cliente = await Cliente.findOne({
          where: { id_usuario: usuario.id },
          attributes: ['id', 'nome']
        });
        if (!cliente) {
          return res.status(403).json({ mensagem: 'Usuario sem cadastro de cliente vinculado.' });
        }
      }

      const accessToken = jwt.sign(
        {},
        segredo,
        {
          algorithm: 'HS256',
          subject: String(usuario.id),
          issuer: JWT_ISSUER,
          expiresIn: '1h'
        }
      );

      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          cargo: usuario.cargo
        },
        cliente
      });
    } catch {
      return res.status(500).json({ mensagem: 'Erro ao autenticar usuario.' });
    }
  }
};