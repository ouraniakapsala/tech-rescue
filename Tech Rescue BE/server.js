// Import dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // 1. Import your new database file

// Initialize the app
const app = express();

// Connect to MongoDB
connectDB(); // 2. Run the connection function

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route so we can check if it's working
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the BOOST_BE API!' });
});

// Define the port and start listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});