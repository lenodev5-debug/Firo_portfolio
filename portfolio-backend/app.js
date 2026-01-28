const express = require('express');
const app = express();
const cors = require('cors');

console.log('🔧 Loading Express app...');

// ====== CORS Configuration ======
console.log('🔧 Setting up CORS...');

// Collect all possible frontend URLs from environment
const allowedOrigins = [
    'https://firo-portfolio-three.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    // Vercel patterns
    'https://*.vercel.app',
    // For mobile apps or direct requests
    'null'
];

// Check all possible environment variables for frontend URL
const envVarsToCheck = [
    'FRONTEND_URL',
    'frontend_Endpoint',
    'RAILWAY_STATIC_URL',
    'RAILWAY_PUBLIC_DOMAIN',
    'CLIENT_URL',
    'CLIENT_ORIGIN',
    'ALLOWED_ORIGIN'
];

envVarsToCheck.forEach(envVar => {
    if (process.env[envVar]) {
        const url = process.env[envVar].trim();
        // Clean up URL (remove trailing slash)
        const cleanUrl = url.replace(/\/$/, '');
        if (!allowedOrigins.includes(cleanUrl)) {
            allowedOrigins.push(cleanUrl);
            console.log(`✅ Added ${envVar} to CORS:`, cleanUrl);
        }
    }
});

console.log('📋 Final allowed origins:', allowedOrigins);

// Dynamic CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) {
            console.log('🌐 Request with no origin (server-to-server or local)');
            return callback(null, true);
        }
        
        console.log('🌐 Incoming request from origin:', origin);
        
        // Check if origin matches any allowed pattern
        const isAllowed = allowedOrigins.some(allowed => {
            // Exact match
            if (allowed === origin) return true;
            
            // Wildcard match (like *.vercel.app)
            if (allowed.includes('*')) {
                // Convert wildcard pattern to regex
                const pattern = allowed
                    .replace(/\./g, '\\.')  // Escape dots
                    .replace(/\*/g, '.*');   // Replace * with .*
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(origin);
            }
            
            return false;
        });
        
        if (isAllowed) {
            console.log('✅ Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('❌ Origin blocked:', origin);
            console.log('📋 Allowed patterns:', allowedOrigins);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Api-Key'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers for preflight and all responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Log all incoming requests for debugging
    console.log('📥', req.method, req.path, '- Origin:', origin || 'None');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('✈️ Preflight request detected');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type, Authorization');
        res.header('Access-Control-Max-Age', '86400');
        return res.status(200).end();
    }
    
    // For all other requests, add CORS headers
    if (origin) {
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed === origin) return true;
            if (allowed.includes('*')) {
                const pattern = allowed.replace(/\./g, '\\.').replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            res.header('Access-Control-Allow-Origin', origin);
        }
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin'); // Important for caching with CORS
    
    next();
});

// ====== Middleware ======
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads directory with CORS
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
}));

// ====== Routes ======
// Health endpoint (always works)
app.get('/api/health', (req, res) => {
    console.log('❤️ Health check from:', req.headers.origin || 'No origin');
    const mongoose = require('mongoose');
    
    res.json({
        status: 'OK',
        message: 'Server is running on Railway',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        cors: {
            allowedOrigins: allowedOrigins,
            requestOrigin: req.headers.origin || 'None'
        },
        database: {
            connected: mongoose.connection.readyState === 1,
            state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
        },
        server: {
            port: process.env.PORT,
            railwayDomain: process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set'
        }
    });
});

// CORS Test endpoint
app.get('/api/cors-test', (req, res) => {
    console.log('🧪 CORS Test Request from:', req.headers.origin);
    res.json({
        success: true,
        message: 'CORS test successful!',
        timestamp: new Date().toISOString(),
        request: {
            origin: req.headers.origin,
            method: req.method,
            ip: req.ip,
            headers: {
                origin: req.headers.origin,
                host: req.headers.host,
                'user-agent': req.headers['user-agent']
            }
        },
        cors: {
            allowedOrigins: allowedOrigins,
            yourOrigin: req.headers.origin || 'None',
            isAllowed: allowedOrigins.some(allowed => {
                if (!req.headers.origin) return false;
                if (allowed === req.headers.origin) return true;
                if (allowed.includes('*')) {
                    const pattern = allowed.replace(/\./g, '\\.').replace(/\*/g, '.*');
                    const regex = new RegExp(`^${pattern}$`);
                    return regex.test(req.headers.origin);
                }
                return false;
            })
        }
    });
});

// Login endpoint
app.post('/api/owners/login', (req, res) => {
    console.log('🔑 Login attempt:', req.body.email || 'No email');
    
    res.json({
        success: true,
        token: 'jwt-demo-token-' + Date.now(),
        owner: {
            email: req.body.email || 'demo@example.com',
            id: 1,
            name: 'Demo User'
        },
        timestamp: new Date().toISOString()
    });
});

// Test other endpoints
app.get('/api/users', (req, res) => {
    console.log('👥 Users endpoint called from:', req.headers.origin);
    res.json({ 
        success: true,
        message: 'Users endpoint working',
        data: [],
        timestamp: new Date().toISOString(),
        cors: {
            allowed: true,
            origin: req.headers.origin
        }
    });
});

app.get('/api/user-services', (req, res) => {
    console.log('🛠️ User services endpoint called from:', req.headers.origin);
    res.json({ 
        success: true,
        message: 'User services endpoint working',
        data: [],
        timestamp: new Date().toISOString()
    });
});

app.get('/api/achievements', (req, res) => {
    console.log('🏆 Achievements endpoint called from:', req.headers.origin);
    res.json({ 
        success: true,
        message: 'Achievements endpoint working',
        data: [],
        timestamp: new Date().toISOString()
    });
});

app.get('/api/contact', (req, res) => {
    console.log('📞 Contact endpoint called from:', req.headers.origin);
    res.json({ 
        success: true,
        message: 'Contact endpoint working',
        timestamp: new Date().toISOString()
    });
});

// API root
app.get('/api', (req, res) => {
    console.log('🏠 API root called from:', req.headers.origin);
    res.json({
        success: true,
        message: 'Portfolio API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        cors: {
            allowedOrigins: allowedOrigins,
            yourOrigin: req.headers.origin || 'None'
        },
        endpoints: [
            'GET    /api/health',
            'GET    /api/cors-test',
            'POST   /api/owners/login',
            'GET    /api/users',
            'GET    /api/user-services',
            'GET    /api/achievements',
            'GET    /api/contact'
        ]
    });
});

// Root endpoint
app.get('/', (req, res) => {
    console.log('🌍 Root endpoint called from:', req.headers.origin);
    res.json({
        success: true,
        name: 'Portfolio Backend API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        cors: {
            enabled: true,
            allowedOrigins: allowedOrigins.length
        },
        links: {
            api: '/api',
            health: '/api/health',
            corsTest: '/api/cors-test',
            github: 'https://github.com',
            documentation: 'https://documentation.url'
        }
    });
});

// 404 handler
app.use((req, res, next) => {
    console.log('❌ Route not found:', req.method, req.originalUrl, 'from:', req.headers.origin);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        availableEndpoints: [
            '/api',
            '/api/health',
            '/api/cors-test',
            '/api/owners/login (POST)',
            '/api/users',
            '/api/user-services',
            '/api/achievements',
            '/api/contact'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('🔥 Express error:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Request from:', req.headers.origin);
    
    // Handle CORS errors specifically
    if (err.message.includes('CORS') || err.message.includes('allowed by CORS')) {
        return res.status(403).json({
            success: false,
            message: 'CORS Error: Request blocked',
            details: err.message,
            solution: 'Contact admin to add your domain to allowed origins',
            allowedOrigins: allowedOrigins,
            yourOrigin: req.headers.origin || 'None',
            timestamp: new Date().toISOString()
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        timestamp: new Date().toISOString()
    });
});

console.log('✅ Express app configured successfully');

module.exports = app;