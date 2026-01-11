const jwt = require('jsonwebtoken');
const User = require('../models/owner');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.createOwner = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'Owner already exists' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const owner = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user' 
        });
        
        await owner.save();
        
        const token = jwt.sign(
            { 
                id: owner._id, 
                role: owner.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        const ownerResponse = owner.toObject();
        delete ownerResponse.password;
        
        res.status(201).json({
            success: true,
            message: 'Owner created successfully',
            token,
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const owner = await User.findOne({ email });
        
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
                role: owner.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        const ownerResponse = owner.toObject();
        delete ownerResponse.password;
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
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

exports.getProfile = async (req, res) => {
    try {
        const owner = await User.findById(req.user.id).select('-password');
        
        if (!owner) {
            return res.status(404).json({ 
                success: false,
                message: 'Owner not found' 
            });
        }
        
        res.status(200).json({
            success: true,
            owner
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
        if (email) updates.email = email;
        
        const owner = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            owner
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
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
                role: owner.role 
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