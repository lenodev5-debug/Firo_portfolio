require('dotenv').config();

console.log('🚀 === SIMPLE SERVER STARTING ===');
console.log('Environment:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);

// CRITICAL: Don't try to connect MongoDB yet
// Just start the server

const express = require('express');
const app = express();

// ====== SIMPLE CORS ======
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.path} from ${req.headers.origin || 'no origin'}`);
    
    // Allow your frontend
    res.header('Access-Control-Allow-Origin', 'https://firo-portfolio-three.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

app.use(express.json());

// ====== BASIC ENDPOINTS ======
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', time: new Date().toISOString() });
});

app.get('/api/owners', (req, res) => {
    res.json({ data: [{ id: 1, name: 'Demo' }] });
});

app.post('/api/owners/login', (req, res) => {
    res.json({ token: 'demo-token', user: { id: 1 } });
});

app.get('/api/users', (req, res) => {
    res.json({ data: [] });
});

app.get('/api/user-services', (req, res) => {
    res.json({ data: [] });
});

app.get('/api/achievements', (req, res) => {
    res.json({ data: [] });
});

app.get('/api', (req, res) => {
    res.json({ name: 'API', endpoints: ['/api/health', '/api/owners'] });
});

// Root
app.get('/', (req, res) => {
    res.json({ name: 'Backend API', status: 'running' });
});

// Start server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ SERVER RUNNING ON PORT ${PORT}`);
    console.log(`🌐 Access: https://lenodev-production.up.railway.app`);
    console.log('🎯 Ready for requests!\n');
});

// Error handling
server.on('error', (error) => {
    console.error('Server error:', error.message);
});