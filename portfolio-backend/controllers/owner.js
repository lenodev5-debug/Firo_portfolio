const jwt = require('jsonwebtoken');
const User = require('../models/owner');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.createOwner = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { username, email, password, role } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide username, email, and password' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: 'Password must be at least 6 characters long' 
            });
        }
        
        const existingUser = await User.findOne({ 
            $or: [{ email: email.toLowerCase() }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email or username already exists' 
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        console.log('Creating user with hashed password...');
        
        const newOwner = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword, 
            role: role || 'user'
        });
        
        await newOwner.save();
        
        console.log('User saved successfully, generating token...');
        
        const token = jwt.sign(
            { 
                id: newOwner._id, 
                role: newOwner.role,
                username: newOwner.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        const ownerResponse = newOwner.toObject();
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            owner: ownerResponse
        });
        
    } catch (error) {
        console.error('Registration error details:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: messages.join(', ') 
            });
        }
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Server Error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const owner = await User.findOne({ email: email.toLowerCase() });
        
        if (!owner) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, owner.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        const token = jwt.sign(
            { 
                id: owner._id, 
                role: owner.role,
                username: owner.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        const ownerResponse = owner.toObject();
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            owner: ownerResponse
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const owner = await User.findById(req.user.id);
        
        if (!owner) {
            return res.status(404).json({ 
                success: false,
                message: 'Owner not found' 
            });
        }
        
        const ownerResponse = owner.toObject();
        
        res.status(200).json({
            success: true,
            owner: ownerResponse
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const updates = {};
        
        if (username) updates.username = username;
        if (email) updates.email = email.toLowerCase();
        
        const owner = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );
        
        const ownerResponse = owner.toObject();
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            owner: ownerResponse
        });
        
    } catch (error) {
        console.error(error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                message: 'Username or email already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: 'New password must be at least 6 characters long' 
            });
        }
        
        const owner = await User.findById(req.user.id);
        
        const isPasswordValid = await bcrypt.compare(currentPassword, owner.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Current password is incorrect' 
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        owner.password = hashedPassword;
        await owner.save();
        
        const token = jwt.sign(
            { 
                id: owner._id, 
                role: owner.role,
                username: owner.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '360d' }
        );
        
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            token
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};