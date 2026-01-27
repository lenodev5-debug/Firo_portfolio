const mongoose = require('mongoose');
const mongodb_URL = process.env.mongodb_URL; // Make sure this matches Railway variable name!

console.log('🔗 Attempting MongoDB connection...');
console.log('MongoDB URL exists:', !!mongodb_URL);

if (!mongodb_URL) {
    console.error('❌ ERROR: mongodb_URL environment variable is not set!');
    console.log('⚠️ Check Railway environment variables');
    console.log('⚠️ Continuing without database connection...');
    // Don't exit - just export mongoose without connection
    module.exports = mongoose;
} else {
    mongoose.connect(mongodb_URL, {
        serverSelectionTimeoutMS: 10000, // 10 second timeout
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error.message);
        console.log('⚠️ Continuing without database connection...');
        // DON'T call process.exit(1) here! This crashes the app
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.once('open', () => {
        console.log('✅ MongoDB connection ready');
    });

    module.exports = mongoose;
}