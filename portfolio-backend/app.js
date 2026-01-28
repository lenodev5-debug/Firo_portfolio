const express = require('express');
const app = express();
const cors = require('cors');

console.log('🔧 Setting up CORS...');

// CORS Configuration
const allowedOrigins = [
    'https://firo-portfolio-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
];

if (process.env.frontend_Endpoint) {
    const frontendOrigin = process.env.frontend_Endpoint.trim();
    if (!allowedOrigins.includes(frontendOrigin)) {
        allowedOrigins.push(frontendOrigin);
        console.log('Added frontend_Endpoint to CORS:', frontendOrigin);
    }
}

console.log('Allowed origins:', allowedOrigins);

app.use(cors({
    origin: allowedOrigins, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Import Routes
const ownerRoutes = require('./routes/owner');
const userRoutes = require('./routes/user');           // Contact messages
const userServiceRoutes = require('./routes/UserService');
const achievementRoutes = require('./routes/Achivements');

console.log('✅ Imported routes');

// Use Routes - IMPORTANT: userRoutes mounted at /api/users
app.use('/api/owners', ownerRoutes);
app.use('/api/users', userRoutes);                    // This makes: GET /api/users/messages
app.use('/api/user-services', userServiceRoutes);
app.use('/api/achievements', achievementRoutes);

// Test Endpoints
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API',
        version: '1.0.0',
        endpoints: [
            '/api/health',
            '/api/owners/login',
            '/api/owners/profile',
            '/api/users/messages',
            '/api/user-services',
            '/api/achievements'
        ]
    });
});

app.get('/', (req, res) => {
    res.json({
        name: 'Portfolio Backend API',
        status: 'running',
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
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