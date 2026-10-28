const express = require('express');
const router = express.Router();
const controller = require('../controllers/agendamentoController');
const { autenticarUsuario, exigirFuncionario } = require('../middleware/autenticarUsuario');

router.get('/', autenticarUsuario, controller.listar);
router.post('/', autenticarUsuario, controller.criar);
router.patch('/:id/confirmar', autenticarUsuario, exigirFuncionario, controller.confirmar);
router.patch('/:id/cancelar', autenticarUsuario, exigirFuncionario, controller.cancelar);

module.exports = router;
