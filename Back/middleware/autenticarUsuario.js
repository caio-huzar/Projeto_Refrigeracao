const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Cliente = require('../models/clienteModel');

const JWT_ISSUER = 'refrigeracao-api';

async function autenticarUsuario(req, res, next) {
  const autorizacao = req.get('authorization') || '';
  const correspondencia = autorizacao.match(/^Bearer\s+(.+)$/i);
  if (!correspondencia) {
    return res.status(401).json({ mensagem: 'Informe um token Bearer valido.' });
  }

  const segredo = process.env.JWT_SECRET;
  if (!segredo || Buffer.byteLength(segredo) < 32) {
    return res.status(503).json({ mensagem: 'Autenticacao indisponivel: configure JWT_SECRET com pelo menos 32 caracteres.' });
  }

  let payload;
  try {
    payload = jwt.verify(correspondencia[1], segredo, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER
    });
  } catch {
    return res.status(401).json({ mensagem: 'Token invalido ou expirado.' });
  }

  const idUsuario = Number(payload.sub);
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return res.status(401).json({ mensagem: 'Token invalido ou expirado.' });
  }

  try {
    const usuario = await User.findByPk(idUsuario, {
      attributes: ['id', 'email', 'cargo', 'esta_ativo']
    });
    if (!usuario || !usuario.esta_ativo) {
      return res.status(401).json({ mensagem: 'Usuario inativo ou nao encontrado.' });
    }

    let clienteId = null;
    if (usuario.cargo === 'cliente') {
      const cliente = await Cliente.findOne({
        where: { id_usuario: usuario.id },
        attributes: ['id']
      });
      if (!cliente) {
        return res.status(403).json({ mensagem: 'Usuario sem cadastro de cliente vinculado.' });
      }
      clienteId = cliente.id;
    }

    req.usuario = {
      id: usuario.id,
      email: usuario.email,
      cargo: usuario.cargo,
      id_cliente: clienteId
    };
    return next();
  } catch {
    return res.status(500).json({ mensagem: 'Erro ao validar usuario.' });
  }
}

function exigirFuncionario(req, res, next) {
  if (req.usuario?.cargo !== 'funcionario') {
    return res.status(403).json({ mensagem: 'Acesso restrito a funcionarios.' });
  }
  return next();
}

module.exports = { autenticarUsuario, exigirFuncionario };