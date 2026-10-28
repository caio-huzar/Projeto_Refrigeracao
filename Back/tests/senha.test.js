const test = require('node:test');
const assert = require('node:assert/strict');
const { gerarHashSenha, verificarSenha } = require('../utils/senha');

test('verifica a senha correspondente ao hash scrypt', async () => {
  const hash = await gerarHashSenha('SenhaSegura123');

  assert.equal(await verificarSenha('SenhaSegura123', hash), true);
  assert.equal(await verificarSenha('senha-errada', hash), false);
});

test('rejeita hashes ausentes ou malformados', async () => {
  assert.equal(await verificarSenha('senha', ''), false);
  assert.equal(await verificarSenha('senha', 'bcrypt:hash'), false);
});