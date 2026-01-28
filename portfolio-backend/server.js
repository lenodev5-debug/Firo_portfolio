// ====== SUPER SIMPLE SERVER - GUARANTEED TO WORK ======
const http = require('http');

console.log('🚀 Starting bulletproof server...');

const server = http.createServer((req, res) => {
    console.log(`📨 ${req.method} ${req.url} from ${req.headers.origin || 'no origin'}`);
    
    // Set CORS headers for EVERY response
    res.setHeader('Access-Control-Allow-Origin', 'https://firo-portfolio-three.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/json');
    
    // Handle preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }
    
    // Simple routing
    if (req.url === '/api/health' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ status: 'OK', time: new Date().toISOString() }));
    }
    
    if (req.url === '/api/owners' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ 
            data: [{ id: 1, name: 'Demo Owner' }],
            success: true 
        }));
    }
    
    if (req.url === '/api/users' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ 
            data: [],
            success: true 
        }));
    }
    
    if (req.url === '/api/user-services' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ 
            data: [],
            success: true 
        }));
    }
    
    if (req.url === '/api' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ 
            name: 'API',
            endpoints: ['/api/health', '/api/owners', '/api/users']
        }));
    }
    
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ 
            name: 'Backend API',
            status: 'running',
            cors: 'enabled'
        }));
    }
    
    // Handle POST /api/owners/login
    if (req.url === '/api/owners/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                token: 'jwt-' + Date.now(),
                user: { id: 1, name: 'Demo User' }
            }));
        });
        return;
    }
    
    // 404 for everything else
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found', path: req.url }));
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ SERVER RUNNING ON PORT ${PORT}`);
    console.log(`🌐 Access: https://lenodev-production.up.railway.app`);
    console.log(`🏥 Health: /api/health`);
    console.log(`👤 Owners: /api/owners`);
    console.log(`🎯 Ready for requests!`);
});

// Catch ALL errors
server.on('error', (error) => {
    console.error('Server error:', error.message);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error.message);
    // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
});