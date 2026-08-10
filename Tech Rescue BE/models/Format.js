const mongoose = require('mongoose');

// Defines the structure for packaging formats (e.g., Box, Pallet, Container)
const formatSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Format', formatSchema);