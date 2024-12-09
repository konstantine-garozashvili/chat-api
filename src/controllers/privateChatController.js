const PrivateChat = require('../models/PrivateChat');
const Message = require('../models/Message');

const privateChatController = {
  // Start or get private chat
  getOrCreateChat: async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check if chat already exists
      let chat = await PrivateChat.findOne({
        participants: { 
          $all: [req.user._id, userId],
          $size: 2
        }
      }).populate('participants', 'username avatar status');

      if (!chat) {
        chat = new PrivateChat({
          participants: [req.user._id, userId]
        });
        await chat.save();
        await chat.populate('participants', 'username avatar status');
      }

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all private chats for user
  getUserChats: async (req, res) => {
    try {
      const chats = await PrivateChat.find({
        participants: req.user._id
      })
      .populate('participants', 'username avatar status')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Send private message
  sendPrivateMessage: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { content } = req.body;

      const chat = await PrivateChat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      // Verify user is participant
      if (!chat.participants.includes(req.user._id)) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const message = new Message({
        sender: req.user._id,
        content,
        room: chatId,
        type: 'private',
        status: chat.participants.map(participantId => ({
          user: participantId,
          status: participantId.equals(req.user._id) ? 'read' : 'sent'
        }))
      });

      await message.save();
      await message.populate('sender', 'username avatar');
      await message.populate('status.user', 'username');

      // Update last message
      chat.lastMessage = message._id;
      await chat.save();

      // Emit to all participants
      const io = req.app.get('io');
      chat.participants.forEach(participantId => {
        io.to(`user_${participantId}`).emit('newPrivateMessage', {
          chatId,
          message
        });
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update message status
  updateMessageStatus: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { status } = req.body;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Find and update the status for current user
      const statusIndex = message.status.findIndex(s => 
        s.user.toString() === req.user._id.toString()
      );

      if (statusIndex > -1) {
        message.status[statusIndex].status = status;
        message.status[statusIndex].updatedAt = new Date();
      }

      await message.save();
      await message.populate('status.user', 'username');

      // Notify sender about status update
      const io = req.app.get('io');
      io.to(`user_${message.sender}`).emit('messageStatusUpdate', {
        messageId: message._id,
        userId: req.user._id,
        status
      });

      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = privateChatController; 