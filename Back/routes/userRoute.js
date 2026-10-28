const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { autenticarUsuario, exigirFuncionario } = require('../middleware/autenticarUsuario');

router.get('/usuarios', autenticarUsuario, exigirFuncionario, controller.index);
router.get('/usuarios/:id', autenticarUsuario, exigirFuncionario, controller.show);
router.post('/usuarios', autenticarUsuario, exigirFuncionario, controller.store);
router.put('/usuarios/:id', autenticarUsuario, exigirFuncionario, controller.update);
router.delete('/usuarios/:id', autenticarUsuario, exigirFuncionario, controller.delete);

module.exports = router;