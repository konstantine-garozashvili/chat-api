const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const user = new User({ username, email, password });
      await user.save();

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.status(201).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          status: user.status
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          status: user.status
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

      console.log(`Total users found: ${users.length}`);
      const formattedUsers = users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt).toLocaleString(),
        id: user._id,
        database: process.env.MONGODB_URI.split('/').pop().split('?')[0] || 'default'
      }));

      console.log('Database URL:', process.env.MONGODB_URI);
      res.json(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController; 