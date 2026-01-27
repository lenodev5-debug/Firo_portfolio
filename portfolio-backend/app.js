const express = require('express');
const app = express();
const cors = require('cors');

// ====== CORS Configuration ======
const allowedOrigins = [
    'https://firo-portfolio-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
];

if (process.env.frontend_Endpoint) {
    allowedOrigins.push(process.env.frontend_Endpoint);
}

console.log('🔧 CORS allowed origins:', allowedOrigins);

// Simple CORS middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400
}));

// ====== Handle preflight for specific problematic routes ======
app.options('/api/owners/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://firo-portfolio-three.vercel.app');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads files
app.use('/uploads', express.static('uploads'));

// ====== Safe route imports ======
let ownerRoutes, userRoutes, userServiceRoutes, achievements, contact;

try {
    ownerRoutes = require('./routes/owner');
} catch (error) {
    console.warn('⚠️ routes/owner.js not found, creating default');
    const router = require('express').Router();
    router.get('/', (req, res) => res.json({ message: 'Owners API' }));
    router.post('/login', (req, res) => {
        console.log('Login attempt:', req.body.email);
        res.json({ 
            success: true,
            token: 'jwt-token-' + Date.now(), 
            owner: { 
                email: req.body.email, 
                id: 1,
                name: 'Test User'
            }
        });
    });
    ownerRoutes = router;
}

try {
    userRoutes = require('./routes/user');
} catch (error) {
    console.warn('⚠️ routes/user.js not found, creating default');
    const router = require('express').Router();
    router.get('/', (req, res) => res.json({ message: 'Users API', data: [] }));
    userRoutes = router;
}

try {
    userServiceRoutes = require('./routes/UserService');
} catch (error) {
    console.warn('⚠️ routes/UserService.js not found, creating default');
    const router = require('express').Router();
    router.get('/', (req, res) => res.json({ message: 'User Services', data: [] }));
    userServiceRoutes = router;
}

try {
    achievements = require('./routes/Achivements');
} catch (error) {
    console.warn('⚠️ routes/Achivements.js not found, creating default');
    const router = require('express').Router();
    router.get('/', (req, res) => res.json({ 
        success: true,
        data: [
            { _id: '1', title: 'Test Achievement', description: 'Test desc', image: 'test.jpg' }
        ]
    }));
    achievements = router;
}

try {
    contact = require('./routes/contact');
} catch (error) {
    console.warn('⚠️ routes/contact.js not found, creating default');
    const router = require('express').Router();
    router.get('/', (req, res) => res.json({ message: 'Contact API' }));
    contact = router;
}

// ====== Routes ======
app.use('/api/owners', ownerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-services', userServiceRoutes);
app.use('/api/achievements', achievements);
app.use('/api/contact', contact);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        cors: allowedOrigins
    });
});

// API root
app.get('/api', (req, res) => {
    res.json({ 
        success: true,
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

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ====== Server Startup ======
const PORT = process.env.PORT || 4444;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`✅ Health: http://localhost:${PORT}/api/health`);
    console.log(`✅ Login: http://localhost:${PORT}/api/owners/login`);
});

module.exports = app;