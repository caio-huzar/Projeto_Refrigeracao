const express = require('express');
const router = express.Router();
const controller = require('../controllers/OSController');
const pecaController = require('../controllers/osPecaController');

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id/total', controller.calcularTotal);
router.get('/:id/pecas', pecaController.listar);
router.post('/:id/pecas', pecaController.registrar);
router.get('/:id', controller.buscar);
router.patch('/:id/status', controller.atualizarStatus);
router.patch('/:id/data', controller.atualizarData);

module.exports = router;