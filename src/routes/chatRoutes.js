const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.get('/messages/:room', auth, chatController.getMessages);
router.post('/messages', auth, chatController.sendMessage);
router.post('/messages/:messageId/read', auth, chatController.markAsRead);

module.exports = router; 