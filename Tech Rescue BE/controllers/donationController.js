const Donation = require('../models/Donation');

// CREATE a new donation
exports.createDonation = async (req, res) => {
    try {
        // We get the producerId from the JWT token (req.user), not from the frontend, for security!
        const newDonation = new Donation({
            ...req.body,
            producerId: req.user.userId 
        });
        const savedDonation = await newDonation.save();
        res.status(201).json(savedDonation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating donation', error: error.message });
    }
};

// READ all available donations
exports.getDonations = async (req, res) => {
    try {
        // .populate() replaces the producerId with the actual company's name and email!
        const donations = await Donation.find().populate('producerId', 'name email');
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations', error: error.message });
    }
};

// DELETE a donation
exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) return res.status(404).json({ message: 'Donation not found' });

        // Security check: Only the producer who created it (or an Admin) can delete it
        if (donation.producerId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this' });
        }

        await donation.deleteOne();
        res.status(200).json({ message: 'Donation successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting donation', error: error.message });
    }
};

// UPDATE donation status to CLAIMED
exports.claimDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) return res.status(404).json({ message: 'Donation not found.' });

        // Prevents double-claiming of an item
        if (donation.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'This donation is no longer available.' });
        }

        // Updates the document with the claiming user's ID and changes the status
        donation.status = 'CLAIMED';
        donation.entityId = req.user.userId;
        await donation.save();

        res.status(200).json({ message: 'Donation claimed successfully.', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error claiming donation.', error: error.message });
    }
};