const express = require('express');
const router = express.Router();
const controller = require('../controllers/OSController');
const pecaController = require('../controllers/osPecaController');
const { autenticarUsuario, exigirFuncionario } = require('../middleware/autenticarUsuario');

router.post('/', autenticarUsuario, exigirFuncionario, controller.criar);
router.get('/', autenticarUsuario, controller.listar);
router.get('/:id/total', autenticarUsuario, controller.calcularTotal);
router.get('/:id/pecas', autenticarUsuario, pecaController.listar);
router.post('/:id/pecas', autenticarUsuario, exigirFuncionario, pecaController.registrar);
router.get('/:id', autenticarUsuario, controller.buscar);
router.patch('/:id/status', autenticarUsuario, exigirFuncionario, controller.atualizarStatus);
router.patch('/:id/data', autenticarUsuario, exigirFuncionario, controller.atualizarData);

module.exports = router;