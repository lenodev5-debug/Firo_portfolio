const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    
    if (req.query && req.query.token) {
        return req.query.token;
    }
    
    return null;
}

const authMiddleware = (req, res, next) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied',
                code: "NO_TOKEN_PROVIDED"
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = {
            id: decoded.id,
            role: decoded.role || 'user'
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired, authorization denied',
                code: "TOKEN_EXPIRED"
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token, authorization denied',
                code: "INVALID_TOKEN"
            });
        }
        
        // Generic error
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            code: "SERVER_ERROR"
        });
    }
};

module.exports = {
    authMiddleware,
    extractToken
};