require('dotenv').config();
const app = require('./app');
const mongoose = require('./database/db');

// Database connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
    console.log('✅ MongoDB connected successfully');
});

// ====== Server Startup ======
const PORT = process.env.PORT || 4444;

// IMPORTANT: Only app.listen() should be here, not in app.js
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`✅ Health: http://localhost:${PORT}/api/health`);
    console.log(`✅ Login: http://localhost:${PORT}/api/owners/login`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
});