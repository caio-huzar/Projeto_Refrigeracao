const express = require('express');
const router = express.Router();
const controller = require('../controllers/pecaController');

router.get('/pecas', controller.index);
router.get('/pecas/:id', controller.show);
router.post('/pecas', controller.store);
router.put('/pecas/:id', controller.update);
router.delete('/pecas/:id', controller.delete);

module.exports = router;