const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Received token:', token);
    
    if (!token) {
      console.log('No token provided');
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('User not found');
      throw new Error();
    }

    console.log('Auth successful for user:', user.username);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth; 