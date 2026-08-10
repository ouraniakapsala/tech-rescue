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

// Route definitions with chained middleware
router.post('/', [auth, role(['PRODUCER', 'ADMIN'])], createDonation);
router.get('/', auth, getDonations);
router.patch('/:id/claim', [auth, role(['ENTITY'])], claimDonation);
router.delete('/:id', [auth, role(['PRODUCER', 'ADMIN'])], deleteDonation);

module.exports = router;