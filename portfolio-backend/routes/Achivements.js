const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authService');
const { uploadImage, handleMulterError } = require('../middleware/upload');
const {
    createAchievement,
    getAllAchievements,
    getAchievementById,
    updateAchievement,
    deleteAchievement,
    getMyAchievements
} = require('../controllers/Achivements'); 

// Add /achievements prefix to all routes
router.get('/achievements', getAllAchievements);
router.get('/achievements/:id', getAchievementById);

router.post('/achievements', 
    authMiddleware, 
    uploadImage.single('image'),  
    handleMulterError,
    createAchievement
);

router.put('/achievements/:id', 
    authMiddleware, 
    uploadImage.single('image'),  
    handleMulterError,
    updateAchievement
);

router.delete('/achievements/:id', authMiddleware, deleteAchievement);
router.get('/user/my-achievements', authMiddleware, getMyAchievements);

module.exports = router;