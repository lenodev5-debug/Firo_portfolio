require('dotenv').config();

console.log('=== Railway Server Startup ===');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- mongodb_URL exists:', !!process.env.mongodb_URL);
console.log('- frontend_Endpoint:', process.env.frontend_Endpoint);

// Load app
const app = require('./app');

// Load mongoose but don't crash if it fails
try {
    const mongoose = require('./database/db');
    
    // Check connection state after a short delay
    setTimeout(() => {
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB is connected');
        } else {
            console.log('⚠️ MongoDB is not connected, but server will continue running');
        }
    }, 2000);
    
} catch (error) {
    console.error('Failed to load database module:', error.message);
    console.log('⚠️ Starting server without database...');
}

// ====== Server Startup ======
const PORT = process.env.PORT || 4444;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎉 Server successfully started on port ${PORT}!`);
    console.log(`🌐 Public URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:' + PORT}`);
    console.log(`🏥 Health endpoint: /api/health`);
    console.log(`🔐 Login endpoint: /api/owners/login`);
    console.log(`\n✅ Ready to accept requests!`);
});