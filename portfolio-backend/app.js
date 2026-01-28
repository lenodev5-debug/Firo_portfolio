const express = require('express');
const app = express();
const cors = require('cors');

console.log('🔧 Setting up CORS...');

// ====== CORS Configuration ======
const allowedOrigins = [
    'https://firo-portfolio-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
];

// Add frontend endpoint from environment
if (process.env.frontend_Endpoint) {
    const frontendOrigin = process.env.frontend_Endpoint.trim();
    if (!allowedOrigins.includes(frontendOrigin)) {
        allowedOrigins.push(frontendOrigin);
        console.log('Added frontend_Endpoint to CORS:', frontendOrigin);
    }
}

console.log('Allowed origins:', allowedOrigins);

// Apply CORS middleware
app.use(cors({
    origin: allowedOrigins, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory
app.use('/uploads', express.static('uploads'));

// ====== IMPORT ACTUAL ROUTES ======
const ownerRoutes = require('./routes/owner');
const userRoutes = require('./routes/user'); // Changed from require('./routes/userController')
const userServiceRoutes = require('./routes/UserService');
const achievementRoutes = require('./routes/Achivements');

console.log('✅ Imported routes: owners, users, userService, achievements');

// ====== USE ACTUAL ROUTES ======
app.use('/api/owners', ownerRoutes);          // This gives us /api/owners/profile
app.use('/api/users', userRoutes);            // This gives us /api/users/messages and /api/users/contact/messages
app.use('/api/user-services', userServiceRoutes); // This gives us /api/user-services
app.use('/api/achievements', achievementRoutes);  // This gives us /api/achievements

// ====== TEST/HEALTH ENDPOINTS ======
// Health endpoint (always works)
app.get('/api/health', (req, res) => {
    console.log('Health check from:', req.headers.origin || 'No origin');
    res.json({
        status: 'OK',
        message: 'Server is running on Railway',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        cors: {
            allowedOrigins: allowedOrigins,
            requestOrigin: req.headers.origin || 'None'
        }
    });
});

// API Documentation
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API',
        version: '1.0.0',
        endpoints: [
            '/api/health',
            '/api/owners/login (POST)',
            '/api/owners/profile (GET - protected)',
            '/api/users/messages (GET)',
            '/api/users/contact/messages (GET - alternative)',
            '/api/user-services (GET, POST, PUT, DELETE)',
            '/api/achievements (GET, POST, PUT, DELETE)'
        ]
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Portfolio Backend API',
        status: 'running',
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res, next) => {
    console.log('404 Route not found:', req.method, req.originalUrl);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            '/api/health',
            '/api/owners/login',
            '/api/owners/profile',
            '/api/users/messages',
            '/api/user-services',
            '/api/achievements'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Express error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;