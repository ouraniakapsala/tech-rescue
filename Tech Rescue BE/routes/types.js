const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getTypes, createType } = require('../controllers/typeController');

// Retrieves type list for authenticated users
router.get('/', auth, getTypes);

// Restricts type creation to ADMIN roles
router.post('/', [auth, role(['ADMIN'])], createType);

module.exports = router;