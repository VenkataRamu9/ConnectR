const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getMessages } = require('../controllers/chatController');

router.get('/rooms/:roomId/messages', verifyToken, getMessages);

module.exports = router;