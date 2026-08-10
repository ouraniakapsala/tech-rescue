const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// These create the /register and /login endpoints
router.post('/register', register);
router.post('/login', login);

module.exports = router;