// routes/Achivements.js - FIXED
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

// CORRECT ROUTES (no /achievements prefix)
router.get('/', getAllAchievements);           // GET /api/achievements
router.get('/:id', getAchievementById);        // GET /api/achievements/:id

router.post('/',                               // POST /api/achievements
    authMiddleware, 
    uploadImage.single('image'),  
    handleMulterError,
    createAchievement
);

router.put('/:id',                            // PUT /api/achievements/:id
    authMiddleware, 
    uploadImage.single('image'),  
    handleMulterError,
    updateAchievement
);

router.delete('/:id', authMiddleware, deleteAchievement);          // DELETE /api/achievements/:id
router.get('/user/my-achievements', authMiddleware, getMyAchievements); // GET /api/achievements/user/my-achievements

module.exports = router;