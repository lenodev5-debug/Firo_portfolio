require('dotenv').config();

console.log('🚀 === Railway Server Startup ===');
console.log('🔧 Environment Check:');
console.log('   PORT:', process.env.PORT || 'Not set (using default)');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'production');
console.log('   mongodb_URL:', process.env.mongodb_URL ? '✓ Set' : '✗ Not set');
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');
console.log('   RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set');

// Load the Express app
const app = require('./app');

// MongoDB Connection (Optional - won't crash app if fails)
if (process.env.mongodb_URL) {
    const mongoose = require('mongoose');
    
    mongoose.connect(process.env.mongodb_URL, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    }).then(() => {
        console.log('✅ MongoDB connected successfully');
    }).catch(err => {
        console.log('⚠️  MongoDB connection failed:', err.message);
        console.log('ℹ️  Running in offline mode - API will work without DB');
    });
} else {
    console.log('ℹ️  No MongoDB URL - running in demo mode');
}

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🎉 ===== SERVER STARTED =====');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Public URL: https://lenodev-production.up.railway.app`);
    console.log(`🏥 Health Check: https://lenodev-production.up.railway.app/api/health`);
    console.log(`🧪 CORS Test: https://lenodev-production.up.railway.app/api/cors-test`);
    console.log('✅ Ready for requests!\n');
});

// Error handlers
server.on('error', (error) => {
    console.error('💥 Server error:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use!`);
        process.exit(1);
    }
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});