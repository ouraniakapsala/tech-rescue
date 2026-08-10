const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getFormats, createFormat } = require('../controllers/formatController');

// Retrieves format list for authenticated users
router.get('/', auth, getFormats);

// Restricts format creation to ADMIN roles
router.post('/', [auth, role(['ADMIN'])], createFormat);

module.exports = router;