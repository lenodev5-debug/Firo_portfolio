const express = require('express');
const router = express.Router();
const { UserMessage, UpdateMessage, DeleteMessage } = require('../controllers/userController');
const { uploadContactFile, handleMulterError } = require('../middleware/upload');

router.post('/contact', 
    uploadContactFile.array('files', 3), 
    handleMulterError,
    UserMessage
);

router.put('/contact/:id', UpdateMessage);

router.delete('/contact/:id', DeleteMessage);

module.exports = router;