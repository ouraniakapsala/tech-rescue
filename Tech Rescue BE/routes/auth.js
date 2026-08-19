const express = require('express');
const router = express.Router();

// Imports controller functions matching exact exported names
const { register, login } = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, PRODUCER, ENTITY]
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: User already exists or invalid data
 */
// Maps the /signup URL endpoint to the register controller function
router.post('/signup', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in with JWT token
 *       400:
 *         description: Invalid credentials
 */
// Maps the /login URL endpoint to the login controller function
router.post('/login', login);

module.exports = router;