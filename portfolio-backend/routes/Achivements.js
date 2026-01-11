const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authService');
const upload = require('../middleware/upload');
const {
    createAchievement,
    getAllAchievements,
    getAchievementById,
    updateAchievement,
    deleteAchievement,
    getMyAchievements
} = require('../controllers/Achievement');

router.get('/', getAllAchievements);
router.get('/:id', getAchievementById);

router.post('/', 
    authMiddleware, 
    upload.single('image'), 
    createAchievement
);

router.put('/:id', 
    authMiddleware, 
    upload.single('image'), 
    updateAchievement
);

router.delete('/:id', authMiddleware, deleteAchievement);
router.get('/user/my-achievements', authMiddleware, getMyAchievements);

module.exports = router;