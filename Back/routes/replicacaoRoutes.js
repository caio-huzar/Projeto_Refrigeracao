const express = require('express');
const router = express.Router();
const controller = require('../controllers/replicacaoController');

router.get('/status', controller.status);
router.post('/sincronizar', controller.sincronizar);
router.post('/testar', controller.testarTempoReal);
router.get('/comparar/:tabela', controller.consultarTabelaReplica);

module.exports = router;
