// Erro com status HTTP, para lançar dentro de transações e responder de forma padronizada
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function responderErro(res, error, statusPadrao, mensagemPadrao) {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Já existe um registro com esse valor único', details: error.message });
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      error: 'Violação de vínculo: o registro referenciado não existe ou está em uso por outro registro',
      details: error.message
    });
  }
  return res.status(statusPadrao).json({ error: mensagemPadrao, details: error.message });
}

module.exports = { httpError, responderErro };