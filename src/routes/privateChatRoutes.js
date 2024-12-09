const express = require('express');
const router = express.Router();
const privateChatController = require('../controllers/privateChatController');
const auth = require('../middleware/auth');

router.get('/chats', auth, privateChatController.getUserChats);
router.get('/chat/:userId', auth, privateChatController.getOrCreateChat);
router.post('/chat/:chatId/messages', auth, privateChatController.sendPrivateMessage);
router.put('/messages/:messageId/status', auth, privateChatController.updateMessageStatus);

module.exports = router; 