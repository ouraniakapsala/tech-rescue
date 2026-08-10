const Format = require('../models/Format');

// Retrieves all available formats
exports.getFormats = async (req, res) => {
    try {
        const formats = await Format.find();
        res.status(200).json(formats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching formats', error: error.message });
    }
};

// Creates a new format entry
exports.createFormat = async (req, res) => {
    try {
        const newFormat = new Format(req.body);
        const savedFormat = await newFormat.save();
        res.status(201).json(savedFormat);
    } catch (error) {
        res.status(500).json({ message: 'Error creating format', error: error.message });
    }
};