const express = require('express');
const router = express.Router();
const controller = require('../controllers/horarioDisponivelController');

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;
