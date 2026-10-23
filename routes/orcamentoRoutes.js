const express = require('express');
const router = express.Router();
const controller = require('../controllers/orcamentoController');

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.patch('/:id/status', controller.atualizarStatus);

module.exports = router;