const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'private'],
    default: 'text'
  },
  status: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema); 