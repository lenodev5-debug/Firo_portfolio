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

// Handle preflight OPTIONS for all routes
// app.options('/*', (req, res) => {
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.header('Access-Control-Allow-Origin', origin);
//     } else if (allowedOrigins.length > 0) {
//         res.header('Access-Control-Allow-Origin', allowedOrigins[0]);
//     }
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.status(200).send();
// });

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory
app.use('/uploads', express.static('uploads'));

// ====== Routes ======
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

// Login endpoint (works without database)
app.post('/api/owners/login', (req, res) => {
    console.log('Login attempt:', req.body.email || 'No email');
    
    // Always return success for testing
    res.json({
        success: true,
        token: 'jwt-demo-token-' + Date.now(),
        owner: {
            email: req.body.email || 'demo@example.com',
            id: 1,
            name: 'Demo User'
        }
    });
});

// Test other endpoints
app.get('/api/users', (req, res) => {
    res.json({ message: 'Users endpoint', data: [] });
});

app.get('/api/user-services', (req, res) => {
    res.json({ message: 'User services endpoint', data: [] });
});

app.get('/api/achievements', (req, res) => {
    res.json({ message: 'Achievements endpoint', data: [] });
});

app.get('/api/contact', (req, res) => {
    res.json({ message: 'Contact endpoint' });
});

// API root
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API',
        version: '1.0.0',
        endpoints: [
            '/api/health',
            '/api/owners/login (POST)',
            '/api/users',
            '/api/user-services',
            '/api/achievements',
            '/api/contact'
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
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
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