const Achievement = require('../models/Achivements');
const path = require('path');
const fs = require('fs');
const { deleteFile } = require('../middleware/cleanup');

exports.createAchievement = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        
        if (!title || !description) {
            if (req.file) await deleteFile(req.file.path);
            
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        if (!req.user) {
            if (req.file) await deleteFile(req.file.path);
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const newAchievement = new Achievement({
            title,
            description,
            date: date || new Date(),
            userId: req.user.id,
            image: req.file ? req.file.path : null
        });

        await newAchievement.save();
        
        res.status(201).json({
            success: true,
            message: 'Achievement created successfully',
            data: newAchievement
        });
    } catch (error) {
        if (req.file) await deleteFile(req.file.path);
        
        console.error('Error creating achievement:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.getAllAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find()
            .sort({ date: -1 })
            .populate('userId', 'username email'); 
        
        res.status(200).json({
            success: true,
            count: achievements.length,
            data: achievements
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id)
            .populate('userId', 'username email'); 
        
        if (!achievement) {
            return res.status(404).json({ 
                success: false,
                message: 'Achievement not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: achievement
        });
    } catch (error) {
        console.error('Error fetching achievement by ID:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.updateAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date } = req.body;
        
        const achievement = await Achievement.findById(id);
        
        if (!achievement) {
            return res.status(404).json({ 
                success: false,
                message: 'Achievement not found' 
            });
        }

        if (achievement.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this achievement'
            });
        }

        if (title) achievement.title = title;
        if (description) achievement.description = description;
        if (date) achievement.date = date;
        
        if (req.file) {
            if (achievement.image && fs.existsSync(achievement.image)) {
                fs.unlinkSync(achievement.image);
            }
            achievement.image = req.file.path;
        }

        const updatedAchievement = await achievement.save();
        
        res.status(200).json({
            success: true,
            message: 'Achievement updated successfully',
            data: updatedAchievement
        });
    } catch (error) {
        console.error('Error updating achievement:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        
        if (!achievement) {
            return res.status(404).json({ 
                success: false,
                message: 'Achievement not found' 
            });
        }

        if (achievement.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this achievement'
            });
        }

        if (achievement.image && fs.existsSync(achievement.image)) {
            fs.unlinkSync(achievement.image);
        }

        await Achievement.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Achievement deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};

exports.getMyAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({ userId: req.user.id })
            .sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            count: achievements.length,
            data: achievements
        });
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error' 
        });
    }
};