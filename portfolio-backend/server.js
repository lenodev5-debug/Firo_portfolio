require('dotenv').config();

console.log('🚀 === Railway Server Startup ===');
console.log('🔧 Environment Check:');
console.log('   PORT:', process.env.PORT || 'Not set');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'production');
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');

// ====== CREATE APP FIRST (before any async operations) ======
const app = require('./app');

// ====== START SERVER IMMEDIATELY ======
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎉 SERVER STARTED ON PORT ${PORT}`);
    console.log(`🌐 Access via: https://lenodev-production.up.railway.app`);
    console.log(`🏥 Health: /api/health`);
    console.log('✅ Ready for requests!\n');
});

// ====== CONNECT MONGODB AFTER SERVER STARTS ======
setTimeout(() => {
    if (process.env.mongodb_URL) {
        const mongoose = require('mongoose');
        console.log('🔗 Attempting MongoDB connection...');
        
        mongoose.connect(process.env.mongodb_URL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }).then(() => {
            console.log('✅ MongoDB connected');
        }).catch(err => {
            console.log('⚠️  MongoDB failed:', err.message);
            console.log('ℹ️  API works without database');
        });
    } else {
        console.log('ℹ️  No MongoDB URL - running without DB');
    }
}, 1000); // Wait 1 second after server starts

// Error handlers
server.on('error', (error) => {
    console.error('💥 Server error:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use!`);
        process.exit(1);
    }
});