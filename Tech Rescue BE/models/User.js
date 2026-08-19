const mongoose = require('mongoose');

// Defines the structure and rules for a user document in the database
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['ADMIN', 'PRODUCER', 'ENTITY'], 
        required: true 
    }
}, { timestamps: true });

// Compiles the schema into a model and exports it for use in controllers
module.exports = mongoose.model('User', userSchema);