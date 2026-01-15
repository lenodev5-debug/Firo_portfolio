const express = require('express');
const router = express.Router();
const { login, getProfile, createOwner, changePassword, updateProfile } = require('../controllers/owner');
const { authMiddleware } = require('../middleware/authService');

// Public routes
router.post('/register', createOwner); // Add this line
router.post('/login',login);

// Protected routes (require authentication)
router.post('/change-password', authMiddleware, changePassword);
router.put('/update-profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;