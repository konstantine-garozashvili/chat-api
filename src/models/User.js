const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  apiKey: {
    key: {
      type: String,
      unique: true
    },
    domains: [{
      type: String,
      trim: true
    }],
    settings: {
      position: {
        type: String,
        enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
        default: 'bottom-right'
      },
      theme: {
        primary: {
          type: String,
          default: '#007bff'
        },
        secondary: {
          type: String,
          default: '#6c757d'
        }
      },
      customCSS: String
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema); 