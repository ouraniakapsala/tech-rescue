const User = require('../models/User');

// Retrieves users, optionally filtered by role via query string
exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query; 
        const query = role ? { role } : {};
        
        // Excludes passwords from the returned data for security
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Retrieves the currently authenticated user's profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};