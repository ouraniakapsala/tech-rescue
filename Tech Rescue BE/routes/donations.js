const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role'); 

// Controller imports
const { 
    createDonation, 
    getDonations, 
    deleteDonation, 
    claimDonation 
} = require('../controllers/donationController');

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Create a new hardware donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - format
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               format:
 *                 type: string
 *     responses:
 *       201:
 *         description: Donation successfully created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires PRODUCER or ADMIN role
 */


// Route definitions with chained middleware
router.post('/', [auth, role(['PRODUCER', 'ADMIN'])], createDonation);

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Retrieve all available donations
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of hardware donations
 *       401:
 *         description: Unauthorized
 */

router.get('/', auth, getDonations);

/**
 * @swagger
 * /api/donations/{id}/claim:
 *   patch:
 *     summary: Claim a specific donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The donation ID
 *     responses:
 *       200:
 *         description: Donation claimed successfully
 *       400:
 *         description: Donation is no longer available
 *       403:
 *         description: Forbidden - Requires ENTITY role
 *       404:
 *         description: Donation not found
 */

router.patch('/:id/claim', [auth, role(['ENTITY'])], claimDonation);

/**
 * @swagger
 * /api/donations/{id}:
 *   delete:
 *     summary: Delete a specific donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The donation ID
 *     responses:
 *       200:
 *         description: Donation successfully deleted
 *       403:
 *         description: Forbidden - Not authorized to delete this
 *       404:
 *         description: Donation not found
 */

router.delete('/:id', [auth, role(['PRODUCER', 'ADMIN'])], deleteDonation);

module.exports = router;