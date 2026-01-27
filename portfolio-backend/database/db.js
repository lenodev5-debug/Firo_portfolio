// database/db.js - SAFE VERSION (WON'T CRASH APP)
const mongoose = require('mongoose');
const mongodb_URL = process.env.mongodb_URL;

console.log('MongoDB module loaded');

if (!mongodb_URL) {
    console.log('⚠️ mongodb_URL not found in environment');
    console.log('✅ App will run without database');
    module.exports = mongoose;
} else {
    console.log('Connecting to MongoDB...');
    
    // Connect with timeout
    mongoose.connect(mongodb_URL, {
        serverSelectionTimeoutMS: 10000, // 10 seconds
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log('✅ MongoDB connected');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        // CRITICAL: DO NOT call process.exit() here!
        console.log('✅ App continues running without database');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB runtime error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    module.exports = mongoose;
}