const express = require('express');
const router = express.Router();
const controller = require('../controllers/orcamentoController');
const { autenticarUsuario, exigirFuncionario } = require('../middleware/autenticarUsuario');

router.post('/', autenticarUsuario, exigirFuncionario, controller.criar);
router.get('/', autenticarUsuario, controller.listar);
router.get('/:id', autenticarUsuario, controller.buscar);
router.patch('/:id/status', autenticarUsuario, controller.atualizarStatus);

module.exports = router;