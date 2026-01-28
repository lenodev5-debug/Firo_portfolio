require('dotenv').config();

console.log('🚀 === Railway Server Startup ===');
console.log('🔧 Environment Check:');
console.log('   PORT:', process.env.PORT || '8080 (default)');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'production');
console.log('   MONGODB_URI:', process.env.mongodb_URL ? '✓ Set' : '✗ Not set');
console.log('   FRONTEND_URL:', process.env.frontend_Endpoint || 'Not set');
console.log('   RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set');

// ====== CRITICAL FIX: Load app BEFORE MongoDB connection ======
// This ensures server starts even if DB connection hangs
const app = require('./app');

// ====== IMPROVED MongoDB Connection ======
if (process.env.mongodb_URL) {
    // Use setTimeout to connect AFTER server is ready
    setTimeout(() => {
        try {
            const mongoose = require('mongoose');
            
            console.log('🔗 Attempting MongoDB connection...');
            
            mongoose.connect(process.env.mongodb_URL, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 30000,
                maxPoolSize: 10,
            }).then(() => {
                console.log('✅ MongoDB connected successfully');
            }).catch(err => {
                console.log('⚠️ MongoDB connection failed:', err.message);
                console.log('ℹ️ Running in demo mode - API works without DB');
            });
            
            mongoose.connection.on('error', (err) => {
                console.error('MongoDB runtime error:', err.message);
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log('🔌 MongoDB disconnected');
            });
            
        } catch (error) {
            console.error('Failed to load mongoose:', error.message);
        }
    }, 1000); // Wait 1 second after server starts
} else {
    console.log('ℹ️ No MongoDB URL - running in demo mode');
}

// ====== START SERVER (MOST IMPORTANT) ======
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎉 SERVER STARTED SUCCESSFULLY!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Public URL: https://lenodev-production.up.railway.app`);
    console.log(`🌐 Railway Domain: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Not available'}`);
    console.log(`🏥 Health: /api/health`);
    console.log(`🔐 Login: POST /api/owners/login`);
    console.log(`📊 Database: ${process.env.mongodb_URL ? 'Connecting...' : 'Demo mode'}`);
    console.log(`\n✅ Ready for requests!`);
});

// ====== IMPROVED ERROR HANDLING ======
server.on('error', (error) => {
    console.error('💥 Server startup error:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use!`);
        process.exit(1);
    }
});

// Graceful shutdown for Railway
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    console.error('🔥 Uncaught Exception:', error.message);
    console.error(error.stack);
    // Don't exit - let server try to recover
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});