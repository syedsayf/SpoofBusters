// spoofbusters-backend/src/models/Settings.js
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    email: {
      scanComplete: {
        type: Boolean,
        default: true
      },
      threatDetected: {
        type: Boolean,
        default: true
      },
      weeklyReport: {
        type: Boolean,
        default: true
      }
    },
    browser: {
      scanComplete: {
        type: Boolean,
        default: true
      },
      threatDetected: {
        type: Boolean,
        default: true
      },
      weeklyReport: {
        type: Boolean,
        default: false
      }
    }
  },
  security: {
    twoFactorAuth: {
      enabled: {
        type: Boolean,
        default: false
      },
      secret: {
        type: String,
        default: null
      }
    },
    sessionTimeout: {
      type: Number,
      default: 30 // minutes
    },
    passwordExpiry: {
      enabled: {
        type: Boolean,
        default: false
      },
      days: {
        type: Number,
        default: 90
      }
    }
  },
  display: {
    theme: {
      type: String,
      enum: ['cyberpunk', 'matrix', 'neon', 'minimal'],
      default: 'cyberpunk'
    },
    darkMode: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
