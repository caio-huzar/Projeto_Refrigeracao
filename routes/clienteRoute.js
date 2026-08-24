const express = require('express');
const router = express.Router();
const controller = require('../controllers/clienteController');

router.get('/clientes', controller.index);
router.get('/clientes/:id', controller.show);
router.post('/clientes', controller.store);
router.put('/clientes/:id', controller.update);
router.delete('/clientes/:id', controller.delete);

module.exports = router;