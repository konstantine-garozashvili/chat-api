const User = require('../models/User');
const Analytics = require('../models/Analytics');

const widgetController = {
  getSettings: async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const user = await User.findOne({ 'apiKey.key': apiKey });
      if (!user) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      // Check domain authorization
      const origin = req.headers.origin;
      if (!user.apiKey.domains.includes(origin)) {
        return res.status(403).json({ error: 'Domain not authorized' });
      }

      res.json(user.apiKey.settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateSettings: async (req, res) => {
    try {
      const { settings } = req.body;
      const user = req.user;

      user.apiKey.settings = {
        ...user.apiKey.settings,
        ...settings
      };
      await user.save();

      res.json(user.apiKey.settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  trackEvent: async (req, res) => {
    try {
      const { event, data } = req.body;
      const apiKey = req.headers['x-api-key'];
      
      const user = await User.findOne({ 'apiKey.key': apiKey });
      if (!user) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      const analytics = new Analytics({
        user: user._id,
        event,
        data,
        domain: req.headers.origin
      });

      await analytics.save();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAnalytics: async (req, res) => {
    try {
      const analytics = await Analytics.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(100);
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = widgetController; 