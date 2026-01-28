// ====== SIMPLEST POSSIBLE WORKING SERVER ======
console.log('🚀 Starting bulletproof server...');

try {
    const http = require('http');
    
    const server = http.createServer((req, res) => {
        console.log(`📨 ${req.method} ${req.url}`);
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json');
        
        // Handle OPTIONS
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        // Always return success
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: 'Server is working!',
            endpoint: req.url,
            method: req.method,
            time: new Date().toISOString()
        }));
    });
    
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
        console.log(`🌐 URL: https://lenodev-production.up.railway.app`);
        console.log('🎯 Responding to ALL requests with 200 OK');
    });
    
    // Handle errors
    server.on('error', (error) => {
        console.error('Server error:', error.message);
    });
    
} catch (error) {
    console.error('FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
}