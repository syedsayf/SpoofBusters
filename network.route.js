const express = require('express');
const router = express.Router();
const Packet = require('../models/Packet'); // Correct path
const { protect, authorize } = require('../middleware/auth'); // Assuming you're using this middleware for role-based access
const systeminformation = require('systeminformation');

// Route to fetch live packet data (with JWT token validation)
router.get('/packets', protect, authorize('admin'), async (req, res) => {
  try {
    const packets = await Packet.find({}).limit(50); // Fetch the latest 50 packets
    res.json(packets); // Send the data back to the frontend
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packets' });
  }
});

// Route to fetch network traffic data
router.get('/traffic', protect, async (req, res) => {
  try {
    const networkStats = await systeminformation.networkStats();
    res.json({
      success: true,
      data: {
        rx_bytes: networkStats[0].rx_bytes,
        tx_bytes: networkStats[0].tx_bytes,
        rx_sec: networkStats[0].rx_sec,
        tx_sec: networkStats[0].tx_sec,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Error fetching network traffic:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching network traffic'
    });
  }
});

module.exports = router;
