const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authService');
const { 
    createUserService, 
    getUserServices,
    getUserServiceById,
    updateUserService, 
    deleteUserService,
    getMyServices
} = require('../controllers/UserService');

router.get('/', getUserServices); 
router.get('/:id', getUserServiceById); 

router.post('/', authMiddleware, createUserService);
router.put('/:id', authMiddleware, updateUserService); 
router.delete('/:id', authMiddleware, deleteUserService); 
router.get('/user/my-services', authMiddleware, getMyServices); 

module.exports = router;