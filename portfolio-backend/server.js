require('dotenv').config();

console.log('=== Railway Server Startup ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV || 'production');
console.log('mongodb_URL:', process.env.mongodb_URL ? 'Set' : 'Not set');
console.log('frontend_Endpoint:', process.env.frontend_Endpoint || 'Not set');

// Load app first (CORS setup happens here)
const app = require('./app');

// Try to connect MongoDB but don't crash if it fails
let mongoConnected = false;
if (process.env.mongodb_URL) {
    try {
        const mongoose = require('mongoose');
        
        // Connect without blocking
        mongoose.connect(process.env.mongodb_URL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000,
        }).then(() => {
            console.log('✅ MongoDB connected successfully');
            mongoConnected = true;
        }).catch(err => {
            console.error('❌ MongoDB connection failed:', err.message);
            console.log('⚠️ Running without database...');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB error:', err.message);
        });
        
    } catch (error) {
        console.error('Failed to load mongoose:', error.message);
    }
} else {
    console.log('⚠️ No MongoDB URL provided');
}

// Start server - CRITICAL: Use Railway's PORT
const PORT = process.env.PORT || 4444;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎉 SERVER STARTED SUCCESSFULLY!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Railway URL: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Check Railway dashboard'}`);
    console.log(`🏥 Health: /api/health`);
    console.log(`🔐 Login: POST /api/owners/login`);
    console.log(`\n✅ Ready for requests!`);
});

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message);
    console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});