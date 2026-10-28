const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(scryptCallback);

async function gerarHashSenha(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(senha, salt, 64);
  return `scrypt:${salt}:${hash.toString('hex')}`;
}

async function verificarSenha(senha, senhaHash) {
  if (typeof senha !== 'string' || typeof senhaHash !== 'string') return false;

  const [algoritmo, salt, hashHex, ...extras] = senhaHash.split(':');
  if (
    algoritmo !== 'scrypt' || extras.length > 0 ||
    !/^[a-f0-9]{32}$/i.test(salt || '') ||
    !/^[a-f0-9]{128}$/i.test(hashHex || '')
  ) return false;

  const hashEsperado = Buffer.from(hashHex, 'hex');
  const hashRecebido = await scrypt(senha, salt, hashEsperado.length);
  return timingSafeEqual(hashRecebido, hashEsperado);
}

module.exports = { gerarHashSenha, verificarSenha };