const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // This connects using the MONGO_URI from your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Database Connection Error: ${error.message}`);
        // If the database fails to connect, we stop the server entirely
        process.exit(1); 
    }
};

module.exports = connectDB;