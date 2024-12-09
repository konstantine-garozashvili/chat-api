const User = require('../models/User');

const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { username, email, avatar } = req.body;
      const user = await User.findById(req.user._id);

      if (username) user.username = username;
      if (email) user.email = email;
      if (avatar) user.avatar = avatar;

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Regenerate API key
  regenerateApiKey: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.apiKey.key = generateApiKey();
      await user.save();
      res.json({ apiKey: user.apiKey.key });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user statistics
  getStats: async (req, res) => {
    try {
      const stats = await Analytics.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: null,
            totalMessages: {
              $sum: { $cond: [{ $eq: ["$event", "message_sent"] }, 1, 0] }
            },
            totalConversations: {
              $sum: { $cond: [{ $eq: ["$event", "conversation_started"] }, 1, 0] }
            }
          }
        }
      ]);

      res.json(stats[0] || { totalMessages: 0, totalConversations: 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}; 