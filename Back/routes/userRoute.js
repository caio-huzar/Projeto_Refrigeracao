const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/usuarios', controller.index);
router.get('/usuarios/:id', controller.show);
router.post('/usuarios', controller.store);
router.put('/usuarios/:id', controller.update);
router.delete('/usuarios/:id', controller.delete);

module.exports = router;