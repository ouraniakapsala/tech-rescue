const mongoose = require('mongoose');

// Defines the structure for categorization tags
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);