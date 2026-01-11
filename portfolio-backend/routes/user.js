const { DelteMessage, UpdateMessage, UserMessage } = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/message', UserMessage);
router.put('/message/:id', UpdateMessage);
router.delete('/message/:id', DelteMessage);

module.exports = router