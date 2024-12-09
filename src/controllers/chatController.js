const Message = require('../models/Message');

const chatController = {
  // Get messages for a specific room
  getMessages: async (req, res) => {
    try {
      const { room } = req.params;
      const messages = await Message.find({ room })
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Send a new message
  sendMessage: async (req, res) => {
    try {
      const { content, room } = req.body;
      const message = new Message({
        content,
        room,
        sender: req.user._id,
        type: 'text'
      });

      await message.save();
      await message.populate('sender', 'username avatar');

      // Emit to socket
      req.app.get('io').to(room).emit('newMessage', message);

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark message as read
  markAsRead: async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await Message.findById(messageId);
      
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const alreadyRead = message.readBy.some(read => 
        read.toString() === req.user._id.toString()
      );

      if (!alreadyRead) {
        message.readBy.push(req.user._id);
        await message.save();
        
        // Notify others that message was read
        req.app.get('io').to(message.room).emit('messageRead', {
          messageId: message._id,
          userId: req.user._id,
          username: req.user.username
        });
      }

      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = chatController; 