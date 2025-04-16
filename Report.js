const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  target: {
    type: String,
    required: [true, 'Please provide a target URL or domain'],
    trim: true
  },
  type: {
    type: String,
    enum: ['quick', 'deep'],
    default: 'quick'
  },
  threatLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  findings: {
    type: Number,
    default: 0
  },
  details: [{
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
