const express = require('express');
const app = express();

console.log('🔧 Loading Express app...');

// ====== SIMPLEST POSSIBLE CORS ======
app.use((req, res, next) => {
    // ALWAYS allow requests from your frontend
    res.header('Access-Control-Allow-Origin', 'https://firo-portfolio-three.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== ALL YOUR ENDPOINTS ======

// Health check - ALWAYS WORKS
app.get('/api/health', (req, res) => {
    console.log('❤️ Health check from:', req.headers.origin || 'unknown');
    res.json({
        status: 'healthy',
        server: 'running',
        time: new Date().toISOString(),
        cors: 'enabled'
    });
});

// Owners endpoints
app.get('/api/owners', (req, res) => {
    console.log('👤 GET /api/owners called');
    res.json({
        success: true,
        data: [{ id: 1, name: 'Demo Owner' }],
        count: 1
    });
});

app.post('/api/owners/login', (req, res) => {
    console.log('🔑 Login attempt:', req.body.email || 'no email');
    res.json({
        success: true,
        token: 'demo-token-' + Date.now(),
        user: { id: 1, email: req.body.email || 'demo@example.com' }
    });
});

// Other GET endpoints your frontend wants
app.get('/api/users', (req, res) => {
    res.json({ success: true, data: [], count: 0 });
});

app.get('/api/user-services', (req, res) => {
    res.json({ success: true, data: [], count: 0 });
});

app.get('/api/achievements', (req, res) => {
    res.json({ success: true, data: [], count: 0 });
});

app.get('/api', (req, res) => {
    res.json({
        api: 'Portfolio Backend',
        endpoints: [
            'GET  /api',
            'GET  /api/health',
            'GET  /api/owners',
            'POST /api/owners/login',
            'GET  /api/users',
            'GET  /api/user-services',
            'GET  /api/achievements'
        ]
    });
});

// Root
app.get('/', (req, res) => {
    res.json({ 
        name: 'Portfolio API',
        status: 'running',
        cors: 'enabled for https://firo-portfolio-three.vercel.app'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        path: req.path,
        method: req.method
    });
});

console.log('✅ Express app ready');
module.exports = app;