const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: String,
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  domain: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema); 