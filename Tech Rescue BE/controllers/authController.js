const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP LOGIC
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save new user to database
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User created successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // 2. Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // 3. Create the JWT payload
        const payload = { userId: user._id, role: user.role };

        // 4. Sign and send the token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ token, role: user.role, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};