const express = require('express');
const router = express.Router();
const controller = require('../controllers/tecnicoController');

router.get('/tecnicos', controller.index);
router.get('/tecnicos/:id', controller.show);
router.post('/tecnicos', controller.store);
router.put('/tecnicos/:id', controller.update);
router.delete('/tecnicos/:id', controller.delete);

module.exports = router;