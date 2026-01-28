// ====== FIXED BACKEND WITH PROPER CORS ======
console.log('🚀 Starting backend with proper CORS...');

const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
    
    // CORS headers - ALWAYS SET THESE FIRST
    res.setHeader('Access-Control-Allow-Origin', 'https://firo-portfolio-three.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // CRITICAL FIX: Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
        console.log('✈️ Handling OPTIONS preflight request');
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Set Content-Type for all other responses
    res.setHeader('Content-Type', 'application/json');
    
    // SIMPLE ROUTING
    if (req.url === '/api/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'OK',
            time: new Date().toISOString(),
            message: 'Backend is working with CORS',
            cors: {
                allowedOrigin: 'https://firo-portfolio-three.vercel.app',
                methods: 'GET, POST, PUT, DELETE, OPTIONS'
            }
        }));
        return;
    }
    
    if (req.url === '/api/owners' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: [{ id: 1, name: 'Demo Owner', email: 'owner@example.com' }],
            count: 1
        }));
        return;
    }
    
    if (req.url === '/api/users' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: [],
            count: 0
        }));
        return;
    }
    
    if (req.url === '/api/user-services' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: [],
            count: 0
        }));
        return;
    }
    
    if (req.url === '/api/achievements' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: [
                { id: 1, title: 'First Project', year: 2023 },
                { id: 2, title: 'Client Award', year: 2024 }
            ],
            count: 2
        }));
        return;
    }
    
    if (req.url === '/api' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            name: 'Portfolio API',
            endpoints: [
                '/api/health',
                '/api/owners',
                '/api/users',
                '/api/user-services',
                '/api/achievements',
                '/api/owners/login'
            ]
        }));
        return;
    }
    
    // Handle POST /api/owners/login - FIXED
    if (req.url === '/api/owners/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            console.log('🔑 Login attempt with:', body);
            
            let parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch {
                parsedBody = { email: 'unknown@example.com' };
            }
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                token: 'jwt-' + Date.now(),
                owner: {
                    id: 1,
                    email: parsedBody.email || 'demo@example.com',
                    name: 'Demo User',
                    role: 'admin'
                },
                message: 'Login successful'
            }));
        });
        return;
    }
    
    // Root endpoint
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            name: 'Portfolio Backend API',
            status: 'running',
            cors: 'enabled for https://firo-portfolio-three.vercel.app'
        }));
        return;
    }
    
    // 404 for everything else
    res.writeHead(404);
    res.end(JSON.stringify({
        error: 'Not found',
        path: req.url,
        method: req.method
    }));
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ SERVER RUNNING ON PORT ${PORT}`);
    console.log(`🌐 Your backend URL: https://lenodev-production.up.railway.app`);
    console.log(`🏥 Health check: https://lenodev-production.up.railway.app/api/health`);
    console.log(`🔐 Login endpoint: POST https://lenodev-production.up.railway.app/api/owners/login`);
    console.log('🎯 Ready for requests!\n');
    
    // Test message
    console.log('🧪 To test CORS, run:');
    console.log(`   curl -H "Origin: https://firo-portfolio-three.vercel.app" \\`);
    console.log(`        -X OPTIONS https://lenodev-production.up.railway.app/api/owners/login`);
});

// Error handling
server.on('error', (error) => {
    console.error('Server error:', error.message);
});