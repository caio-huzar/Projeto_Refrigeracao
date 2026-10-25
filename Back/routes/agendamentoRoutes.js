const express = require('express');
const router = express.Router();
const controller = require('../controllers/agendamentoController');

router.get('/', controller.listar);
router.post('/', controller.criar);
router.patch('/:id/confirmar', controller.confirmar);
router.patch('/:id/cancelar', controller.cancelar);

module.exports = router;
