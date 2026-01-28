const express = require('express');
const router = express.Router();
const { 
    UserMessage, 
    UpdateMessage, 
    DeleteMessage, 
    GetAllMessages 
} = require('../controllers/userController');
const { uploadContactFile, handleMulterError } = require('../middleware/upload');

// GET all messages
router.get('/messages', GetAllMessages);

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