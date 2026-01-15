const express = require('express');
const app = express();
const cors = require('cors'); // Import cors here

// ====== Middleware ======
// CORS MUST come first
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server uploads files
app.use('/uploads', express.static('uploads'));

// ====== import Routes ======
const ownerRoutes = require('./routes/owner');
const userRoutes = require('./routes/user'); 
const userServiceRoutes = require('./routes/UserService');
const achivements = require('./routes/Achivements')

// ====== Routes ======
app.use('/api/owners', ownerRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/user-services', userServiceRoutes);
app.use('/api', achivements);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler (important to add)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;