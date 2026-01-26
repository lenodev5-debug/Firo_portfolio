const Achievement = require('../models/Achivements');
const { deleteFile } = require('../middleware/cleanup');

exports.createAchievement = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        
        console.log('Creating achievement with:', { title, description, date });
        console.log('User:', req.user);
        console.log('File:', req.file);
        
        if (!title || !description) {
            if (req.file) await deleteFile(req.file.path);
            
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        if (!req.user || !req.user.id) {
            if (req.file) await deleteFile(req.file.path);
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        let imagePath = null;
        if (req.file) {
            const filename = req.file.filename || path.basename(req.file.path);
            imagePath = `/uploads/achievements/${filename}`;
            console.log('Image stored at:', imagePath);
        }

        const newAchievement = new Achievement({
            title,
            description,
            date: date || new Date(),
            userId: req.user.id,
            image: imagePath
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
            message: 'Server Error',
            error: error.message 
        });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await AchievementModel.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: 'Achievement not found'
            });
        }
        res.json({
            success: true,
            data: achievement
        });
    } catch (error) {
        console.error('Error fetching achievement:', error);
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
        
        const transformedAchievements = achievements.map(achievement => {
            const achievementObj = achievement.toObject();
            if (achievementObj.image) {
                if (!achievementObj.image.startsWith('/uploads/')) {
                    achievementObj.image = `/uploads/achievements/${path.basename(achievementObj.image)}`;
                }
            }
            return achievementObj;
        });
        
        res.status(200).json({
            success: true,
            count: achievements.length,
            data: transformedAchievements
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

exports.updateAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date } = req.body;
        
        console.log('Updating achievement:', id);
        console.log('Body:', { title, description, date });
        console.log('File:', req.file);
        
        const achievement = await Achievement.findById(id);
        
        if (!achievement) {
            if (req.file) await deleteFile(req.file.path);
            return res.status(404).json({ 
                success: false,
                message: 'Achievement not found' 
            });
        }

        if (achievement.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            if (req.file) await deleteFile(req.file.path);
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this achievement'
            });
        }

        if (title) achievement.title = title;
        if (description) achievement.description = description;
        if (date) achievement.date = date;
        
        if (req.file) {
            if (achievement.image) {
                const oldImagePath = path.join(__dirname, '..', achievement.image);
                await deleteFile(oldImagePath);
            }
            
            const filename = req.file.filename || path.basename(req.file.path);
            achievement.image = `/uploads/achievements/${filename}`;
            console.log('Updated image to:', achievement.image);
        }

        const updatedAchievement = await achievement.save();
        
        res.status(200).json({
            success: true,
            message: 'Achievement updated successfully',
            data: updatedAchievement
        });
    } catch (error) {
        if (req.file) await deleteFile(req.file.path);
        console.error('Error updating achievement:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
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

        if (achievement.image) {
            const imagePath = path.join(__dirname, '..', achievement.image);
            await deleteFile(imagePath);
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
            message: 'Server Error',
            error: error.message 
        });
    }
};

exports.getMyAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({ userId: req.user.id })
            .sort({ date: -1 });
        
        const transformedAchievements = achievements.map(achievement => {
            const achievementObj = achievement.toObject();
            if (achievementObj.image && !achievementObj.image.startsWith('/uploads/')) {
                achievementObj.image = `/uploads/achievements/${path.basename(achievementObj.image)}`;
            }
            return achievementObj;
        });
        
        res.status(200).json({
            success: true,
            count: achievements.length,
            data: transformedAchievements
        });
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};