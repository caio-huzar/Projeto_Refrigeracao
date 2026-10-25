const { randomBytes, scrypt: scryptCallback } = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(scryptCallback);

async function gerarHashSenha(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(senha, salt, 64);
  return `scrypt:${salt}:${hash.toString('hex')}`;
}

module.exports = { gerarHashSenha };