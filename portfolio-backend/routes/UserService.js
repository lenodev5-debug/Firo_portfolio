// routes/UserService.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authService');
const { uploadImage, uploadMultipleImages } = require('../middleware/upload'); // UPDATE IMPORT
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

// UPDATE: Use uploadMultipleImages for multiple images
router.post('/', authMiddleware, uploadImage.single('mainImage'), uploadMultipleImages, createUserService);
router.put('/:id', authMiddleware, uploadImage.single('mainImage'), uploadMultipleImages, updateUserService);
router.delete('/:id', authMiddleware, deleteUserService); 
router.get('/user/my-services', authMiddleware, getMyServices); 

module.exports = router;