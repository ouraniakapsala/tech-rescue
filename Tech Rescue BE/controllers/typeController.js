const Type = require('../models/Type');

// Retrieves all available types
exports.getTypes = async (req, res) => {
    try {
        const types = await Type.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching types', error: error.message });
    }
};

// Creates a new type entry
exports.createType = async (req, res) => {
    try {
        const newType = new Type(req.body);
        const savedType = await newType.save();
        res.status(201).json(savedType);
    } catch (error) {
        res.status(500).json({ message: 'Error creating type', error: error.message });
    }
};