const express = require('express');
const router = express.Router();
const controller = require('../controllers/servicoController');

router.get('/servicos', controller.index);
router.get('/servicos/:id', controller.show);
router.post('/servicos', controller.store);
router.put('/servicos/:id', controller.update);
router.delete('/servicos/:id', controller.delete);

module.exports = router;