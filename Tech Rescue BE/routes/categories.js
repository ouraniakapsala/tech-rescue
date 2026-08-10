const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getCategories, createCategory } = require('../controllers/categoryController');

// Allows any authenticated user to view the list of categories
router.get('/', auth, getCategories);

// Restricts category creation exclusively to ADMIN roles
router.post('/', [auth, role(['ADMIN'])], createCategory);

module.exports = router;