const test = require('node:test');
const assert = require('node:assert/strict');
const { aplicarFiltroCliente, pertenceAoCliente } = require('../utils/escopoCliente');

test('o id do cliente autenticado prevalece sobre qualquer filtro enviado', () => {
  const req = { usuario: { cargo: 'cliente', id_cliente: 12 } };
  const filtro = aplicarFiltroCliente(req, { id_cliente: 99, status: 'aberta' });

  assert.deepEqual(filtro, { id_cliente: 12, status: 'aberta' });
});

test('um cliente nao acessa recursos de outro cliente', () => {
  const req = { usuario: { cargo: 'cliente', id_cliente: 12 } };

  assert.equal(pertenceAoCliente(req, 12), true);
  assert.equal(pertenceAoCliente(req, 99), false);
});