const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "15 Dell Ultrasharp Monitors"
    description: { type: String }, // Details about specs or defects
    category: { type: String, required: true }, // e.g., "Monitors", "Laptops", "Cables"
    format: { type: String, required: true }, // e.g., "Pallet", "Boxes", "Single Item"
    
    // This links the donation to the specific Tech Company (Producer) that created it
    producerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
    ,
    status: { 
        type: String, 
        enum: ['AVAILABLE', 'CLAIMED', 'DELIVERED'], 
        default: 'AVAILABLE' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);