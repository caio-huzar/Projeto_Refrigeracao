const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();

router.post('/auth/login', controller.login);

module.exports = router;