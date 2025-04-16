const mongoose = require('mongoose');

const packetSchema = new mongoose.Schema({
  source_ip: { type: String, required: true },
  destination_ip: { type: String, required: true },
  timestamp: { type: String, required: true },
  status: { type: String, required: true }, // "Spoofed", "Legit", etc.
});

module.exports = mongoose.model('Packet', packetSchema, 'network_data.packets');
