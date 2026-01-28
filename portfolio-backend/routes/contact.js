const express = require('express');
const router = express.Router();
const { UserMessage, UpdateMessage, DeleteMessage } = require('../controllers/userController');
const { uploadContactFile, handleMulterError } = require('../middleware/upload');
const ContactMessage = require('../models/user');

// GET all messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST new message
router.post('/', 
    uploadContactFile.array('files', 3), 
    handleMulterError,
    UserMessage
);

// UPDATE message
router.put('/:id', UpdateMessage);

// DELETE message
router.delete('/:id', DeleteMessage);

module.exports = router;