const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Initializes Express application
const app = express();

// Establishes connection to MongoDB
connectDB();

// Middleware for parsing JSON and enabling cross-origin requests
app.use(express.json());
app.use(cors());

// Route Imports 
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const formatRoutes = require('./routes/formats');
const typeRoutes = require('./routes/types');

// Route Assignments
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/formats', formatRoutes);
app.use('/api/types', typeRoutes);

// Root endpoint for API health check
app.get('/', (req, res) => {
    res.send('Tech Rescue API is running...');
});

// Server listener initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});