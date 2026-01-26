const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authService');
const { uploadImage } = require('../middleware/upload'); // ADD THIS IMPORT
const { 
    createUserService, 
    getUserServices,
    getUserServiceById,
    updateUserService, 
    deleteUserService,
    getMyServices,
    countProject
} = require('../controllers/UserService');

router.get('/', getUserServices); 
router.get('/:id', getUserServiceById); 
router.get('/stats/count-by-type', countProject)

// ADD uploadImage.single('image') middleware to POST and PUT routes
router.post('/', authMiddleware, uploadImage.single('image'), createUserService); // FIXED
router.put('/:id', authMiddleware, uploadImage.single('image'), updateUserService); // FIXED
router.delete('/:id', authMiddleware, deleteUserService); 
router.get('/user/my-services', authMiddleware, getMyServices); 

module.exports = router;