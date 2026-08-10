const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getUsers, getProfile } = require('../controllers/userController');

// Restricts the user list view exclusively to ADMIN roles
router.get('/', [auth, role(['ADMIN'])], getUsers);

// Allows any authenticated user to view their own profile data
router.get('/profile', auth, getProfile);

module.exports = router;