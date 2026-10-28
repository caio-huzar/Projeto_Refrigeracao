const express = require('express');
const router = express.Router();
const controller = require('../controllers/clienteController');
const { autenticarUsuario, exigirFuncionario } = require('../middleware/autenticarUsuario');

router.post('/clientes/cadastro', controller.cadastrarComUsuario);
router.get('/clientes', autenticarUsuario, controller.index);
router.get('/clientes/:id', autenticarUsuario, controller.show);
router.post('/clientes', autenticarUsuario, exigirFuncionario, controller.store);
router.put('/clientes/:id', autenticarUsuario, exigirFuncionario, controller.update);
router.delete('/clientes/:id', autenticarUsuario, exigirFuncionario, controller.delete);

module.exports = router;