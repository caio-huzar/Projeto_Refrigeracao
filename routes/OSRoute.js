const express = require('express');
const router = express.Router();
const controller = require('../controllers/OSController');

router.get('/os', controller.index);
router.get('/os/:id', controller.show);
router.post('/os', controller.store);
router.put('/os/:id', controller.update);
router.delete('/os/:id', controller.delete);

module.exports = router;