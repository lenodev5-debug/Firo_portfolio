require('dotenv').config();

console.log('=== Railway Server Startup ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV || 'production');
console.log('mongodb_URL:', process.env.mongodb_URL ? 'Set' : 'Not set');
console.log('frontend_Endpoint:', process.env.frontend_Endpoint || 'Not set');
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set');

// ====== MongoDB Connection ======
let mongoConnected = false;
if (process.env.mongodb_URL) {
    try {
        const mongoose = require('mongoose');
        
        // MongoDB connection with retry logic
        const connectWithRetry = () => {
            mongoose.connect(process.env.mongodb_URL, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 30000,
                maxPoolSize: 10,
                retryWrites: true,
                w: 'majority'
            }).then(() => {
                console.log('✅ MongoDB connected successfully');
                mongoConnected = true;
            }).catch(err => {
                console.error('❌ MongoDB connection failed:', err.message);
                console.log('⚠️ Retrying in 5 seconds...');
                setTimeout(connectWithRetry, 5000);
            });
        };
        
        connectWithRetry();
        
        mongoose.connection.on('connected', () => {
            console.log('🔗 MongoDB is connected');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB error:', err.message);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected');
            mongoConnected = false;
        });
        
    } catch (error) {
        console.error('Failed to load mongoose:', error.message);
    }
} else {
    console.log('⚠️ No MongoDB URL provided, running without database');
}

// ====== Load Express App ======
const app = require('./app');

// ====== Start Server ======
const PORT = process.env.PORT || 4444;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎉 SERVER STARTED SUCCESSFULLY!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Railway URL: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Check Railway dashboard'}`);
    console.log(`🌐 Public URL: https://lenodev-production.up.railway.app`);
    console.log(`🏥 Health: https://lenodev-production.up.railway.app/api/health`);
    console.log(`🧪 CORS Test: https://lenodev-production.up.railway.app/api/cors-test`);
    console.log(`🔐 Login: POST https://lenodev-production.up.railway.app/api/owners/login`);
    console.log(`\n✅ Ready for requests!`);
    console.log(`\n=== Server Status ===`);
    console.log(`Database: ${mongoConnected ? '✅ Connected' : '❌ Not connected'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`========================================\n`);
});

// ====== Server Error Handlers ======
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        console.error('Server error:', error);
    }
});

// ====== Graceful Shutdown ======
const gracefulShutdown = () => {
    console.log('\n🛑 Received shutdown signal, closing server...');
    
    server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Close MongoDB connection if exists
        if (mongoConnected) {
            const mongoose = require('mongoose');
            mongoose.connection.close(false, () => {
                console.log('✅ MongoDB connection closed');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcing shutdown');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// ====== Global Error Handlers ======
process.on('uncaughtException', (error) => {
    console.error('\n🔥 Uncaught Exception:', error.message);
    console.error(error.stack);
    // Don't exit immediately, let the server try to recover
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('\n🔥 Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});