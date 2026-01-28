const express = require('express');
const app = express();
const cors = require('cors');

console.log('🔧 Loading Express application...');

// ====== CORS CONFIGURATION ======
console.log('🔧 Setting up CORS middleware...');

// Define allowed origins - SIMPLE and RELIABLE
const allowedOrigins = [
    'https://firo-portfolio-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
];

// Check for FRONTEND_URL environment variable
if (process.env.FRONTEND_URL) {
    const frontendUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, '');
    if (!allowedOrigins.includes(frontendUrl)) {
        allowedOrigins.push(frontendUrl);
        console.log(`✅ Added FRONTEND_URL from env: ${frontendUrl}`);
    }
}

console.log('📋 Allowed origins:', allowedOrigins);

// SIMPLE CORS middleware - THIS IS THE KEY
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) {
            return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            console.log(`✅ CORS allowing: ${origin}`);
            callback(null, true);
        } else {
            console.log(`❌ CORS blocking: ${origin}`);
            console.log(`   Allowed: ${allowedOrigins.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests explicitly
// app.options('*', cors(corsOptions));

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// ====== ROUTES ======

// Health endpoint - ALWAYS works
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Portfolio Backend API',
        environment: process.env.NODE_ENV || 'production',
        cors: {
            allowedOrigins: allowedOrigins,
            yourOrigin: req.headers.origin || 'No origin header',
            requestMethod: req.method
        },
        database: process.env.mongodb_URL ? 'connected' : 'demo mode'
    });
});

// CORS Test endpoint - test if CORS is working
app.get('/api/cors-test', (req, res) => {
    console.log(`🧪 CORS test from origin: ${req.headers.origin || 'No origin'}`);
    res.json({
        success: true,
        message: 'CORS is working!',
        test: 'pass',
        timestamp: new Date().toISOString(),
        requestInfo: {
            origin: req.headers.origin,
            method: req.method,
            ip: req.ip
        },
        corsInfo: {
            allowedOrigins: allowedOrigins,
            isYourOriginAllowed: req.headers.origin ? 
                allowedOrigins.includes(req.headers.origin) : 'No origin to check'
        }
    });
});

// API endpoints (your actual routes)
app.post('/api/owners/login', (req, res) => {
    console.log('🔑 Login attempt for:', req.body.email || 'unknown');
    res.json({
        success: true,
        token: 'demo-jwt-token-' + Date.now(),
        user: {
            id: 1,
            email: req.body.email || 'demo@example.com',
            name: 'Demo User'
        }
    });
});

app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        data: [],
        message: 'Users endpoint',
        count: 0
    });
});

app.get('/api/user-services', (req, res) => {
    res.json({
        success: true,
        data: [],
        message: 'User services endpoint'
    });
});

app.get('/api/achievements', (req, res) => {
    res.json({
        success: true,
        data: [],
        message: 'Achievements endpoint'
    });
});

app.get('/api/contact', (req, res) => {
    res.json({
        success: true,
        message: 'Contact endpoint - would save contact form data'
    });
});

// API Root
app.get('/api', (req, res) => {
    res.json({
        service: 'Portfolio API',
        version: '1.0.0',
        status: 'operational',
        endpoints: [
            'GET    /api/health',
            'GET    /api/cors-test',
            'POST   /api/owners/login',
            'GET    /api/users',
            'GET    /api/user-services',
            'GET    /api/achievements',
            'GET    /api/contact'
        ],
        cors: {
            allowedOrigins: allowedOrigins
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Portfolio Backend API',
        status: 'running',
        version: '1.0.0',
        documentation: '/api'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`,
        availableEndpoints: [
            '/api',
            '/api/health',
            '/api/cors-test'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('🔥 Server error:', err.message);
    
    // Special handling for CORS errors
    if (err.message.includes('CORS') || err.message.includes('allowed by CORS')) {
        return res.status(403).json({
            success: false,
            error: 'CORS Error',
            message: 'Request blocked by CORS policy',
            solution: 'Your origin is not in the allowed list',
            allowedOrigins: allowedOrigins,
            yourOrigin: req.headers.origin || 'Not provided'
        });
    }
    
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

console.log('✅ Express app configured successfully');
module.exports = app;