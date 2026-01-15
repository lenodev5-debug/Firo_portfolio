const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authService');
const { uploadImage, handleMulterError } = require('../middleware/upload'); // Changed from upload to uploadImage
const {
    createAchievement,
    getAllAchievements,
    getAchievementById,
    updateAchievement,
    deleteAchievement,
    getMyAchievements
} = require('../controllers/Achivements'); // Fixed spelling (Achivements to Achievements)

router.get('/', getAllAchievements);
router.get('/:id', getAchievementById);

router.post('/', 
    authMiddleware, 
    uploadImage.single('image'),  // Changed upload.single to uploadImage.single
    handleMulterError,
    createAchievement
);

router.put('/:id', 
    authMiddleware, 
    uploadImage.single('image'),  // Changed upload.single to uploadImage.single
    handleMulterError,
    updateAchievement
);

router.delete('/:id', authMiddleware, deleteAchievement);
router.get('/user/my-achievements', authMiddleware, getMyAchievements);

module.exports = router;