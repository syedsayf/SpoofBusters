const mongoose = require('mongoose');

const LogEntrySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  sourceIp: {
    type: String,
    required: [true, 'Source IP is required']
  },
  destinationIp: {
    type: String,
    required: [true, 'Destination IP is required']
  },
  protocol: {
    type: String,
    enum: ['TCP', 'UDP', 'ICMP', 'OTHER'],
    default: 'OTHER'
  },
  port: {
    type: Number,
    default: null   // ✅ make optional
  },
  flags: {
    type: String,
    default: null   // ✅ make optional
  },
  packetSize: {
    type: Number,
    default: null   // ✅ make optional
  },
  ttl: {
    type: Number,
    default: null   // ✅ make optional
  },
  isSpoofed: {
    type: Boolean,
    default: false
  },
  spoofConfidence: {
    type: Number,
    default: 0
  },
  analysisDetails: {
    type: String,
    default: null   // ✅ just in case
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
LogEntrySchema.index({ user: 1, timestamp: -1 });
LogEntrySchema.index({ isSpoofed: 1 });

module.exports = mongoose.model('LogEntry', LogEntrySchema);
