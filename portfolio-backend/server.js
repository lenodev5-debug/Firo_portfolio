require('dotenv').config();
const app = require('./app');
const mongoose = require('./database/db');

// Remove CORS from here - it should be in app.js

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
    console.log('✅ MongoDB connected successfully');
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 CORS enabled for: http://localhost:5173, http://localhost:3000`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/users/contact`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
});