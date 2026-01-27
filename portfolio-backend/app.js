const express = require('express');
const app = express();
const cors = require('cors');

// ====== CORS Configuration ======
const allowedOrigins = [
    'https://firo-portfolio-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
];

// Add environment variable if it exists
if (process.env.frontend_Endpoint) {
    allowedOrigins.push(process.env.frontend_Endpoint);
}

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads files
app.use('/uploads', express.static('uploads'));

// ====== IMPORTANT: Safe route imports ======
let ownerRoutes, userRoutes, userServiceRoutes, achievements, contact;

try {
    ownerRoutes = require('./routes/owner');
} catch (error) {
    console.warn('⚠️ routes/owner.js not found, creating default route');
    ownerRoutes = require('express').Router();
    ownerRoutes.get('/', (req, res) => res.json({ message: 'Owners API placeholder' }));
    ownerRoutes.post('/login', (req, res) => res.json({ 
        token: 'dummy-token', 
        owner: { email: req.body.email } 
    }));
}

try {
    userRoutes = require('./routes/user');
} catch (error) {
    console.warn('⚠️ routes/user.js not found, creating default route');
    userRoutes = require('express').Router();
    userRoutes.get('/', (req, res) => res.json({ message: 'Users API placeholder' }));
}

try {
    userServiceRoutes = require('./routes/UserService');
} catch (error) {
    console.warn('⚠️ routes/UserService.js not found, creating default route');
    userServiceRoutes = require('express').Router();
    userServiceRoutes.get('/', (req, res) => res.json({ message: 'User Services placeholder' }));
}

try {
    achievements = require('./routes/Achivements');
} catch (error) {
    console.warn('⚠️ routes/Achivements.js not found, creating default route');
    achievements = require('express').Router();
    achievements.get('/', (req, res) => res.json({ message: 'Achievements placeholder' }));
}

try {
    contact = require('./routes/contact');
} catch (error) {
    console.warn('⚠️ routes/contact.js not found, creating default route');
    contact = require('express').Router();
    contact.get('/', (req, res) => res.json({ message: 'Contact placeholder' }));
}

// ====== Routes ======
app.use('/api/owners', ownerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-services', userServiceRoutes);
app.use('/api/achievements', achievements); // Fixed: Use /api/achievements instead of /api
app.use('/api/contact', contact);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API root endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API is running',
        endpoints: [
            '/api/health',
            '/api/owners',
            '/api/users',
            '/api/user-services',
            '/api/achievements',
            '/api/contact'
        ]
    });
});

// ====== CRITICAL: 404 handler with CORS headers ======
app.use((req, res, next) => {
    // Ensure CORS headers are set even for 404
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        availableEndpoints: '/api'
    });
});

// Error handler with CORS headers
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ====== SERVER STARTUP ======
const PORT = process.env.PORT || 4444;

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`✅ CORS allowed origins: ${allowedOrigins.join(', ')}`);
});

// Handle Railway shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app;