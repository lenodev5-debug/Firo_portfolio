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

if (process.env.frontend_Endpoint) {
    const frontendOrigin = process.env.frontend_Endpoint.trim();
    if (!allowedOrigins.includes(frontendOrigin)) {
        allowedOrigins.push(frontendOrigin);
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== IMPORT ROUTES ======
const ownerRoutes = require('./routes/owner');

// ====== USE ROUTES ======
app.use('/api/owners', ownerRoutes);

// ====== OTHER ENDPOINTS ======
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/users', (req, res) => {
    res.json({ message: 'Users endpoint', data: [] });
});

app.get('/api/user-services', (req, res) => {
    res.json({ message: 'User services endpoint', data: [] });
});

app.get('/api/achievements', (req, res) => {
    res.json({ message: 'Achievements endpoint', data: [] });
});

app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API',
        version: '1.0.0',
        endpoints: [
            '/api/health',
            '/api/owners/login (POST)',
            '/api/owners/register (POST)',
            '/api/users',
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
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

module.exports = app;