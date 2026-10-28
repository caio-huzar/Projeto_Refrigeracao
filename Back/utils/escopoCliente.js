function aplicarFiltroCliente(req, filtros = {}) {
  if (req.usuario?.cargo === 'cliente') {
    return { ...filtros, id_cliente: req.usuario.id_cliente };
  }
  return filtros;
}

function pertenceAoCliente(req, idCliente) {
  return req.usuario?.cargo !== 'cliente' || Number(req.usuario.id_cliente) === Number(idCliente);
}

module.exports = { aplicarFiltroCliente, pertenceAoCliente };