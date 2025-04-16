const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');

// MongoDB connection details (same as in spoof.py)
const MONGO_DB = 'network_data';
const MONGO_COLLECTION = 'packets';

// Apply auth middleware to all routes
router.use(protect);

/**
 * @route   GET /api/reports
 * @desc    Get all network packets from MongoDB
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // Use the existing mongoose connection but switch to network_data database
    const networkDb = mongoose.connection.useDb(MONGO_DB);
    const packetCollection = networkDb.collection(MONGO_COLLECTION);
    
    // Query for all packets, limit to most recent 1000 to prevent overwhelming response
    const packets = await packetCollection.find({}).sort({ _id: -1 }).limit(1000).toArray();
    
    res.json(packets);
  } catch (error) {
    console.error('Error fetching reports from MongoDB:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not fetch reports from MongoDB'
    });
  }
});

/**
 * @route   GET /api/reports/spoofed
 * @desc    Get only spoofed packets
 * @access  Private
 */
router.get('/spoofed', async (req, res) => {
  try {
    const networkDb = mongoose.connection.useDb(MONGO_DB);
    const packetCollection = networkDb.collection(MONGO_COLLECTION);
    
    // Query for spoofed packets
    const packets = await packetCollection
      .find({ status: 'Spoofed' })
      .sort({ _id: -1 })
      .limit(500)
      .toArray();
    
    res.json(packets);
  } catch (error) {
    console.error('Error fetching spoofed packets:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not fetch spoofed packets'
    });
  }
});

/**
 * @route   GET /api/reports/summary
 * @desc    Get statistics about network packets
 * @access  Private
 */
router.get('/summary', async (req, res) => {
  try {
    const networkDb = mongoose.connection.useDb(MONGO_DB);
    const packetCollection = networkDb.collection(MONGO_COLLECTION);
    
    // Get various statistics
    const totalCount = await packetCollection.countDocuments();
    const spoofedCount = await packetCollection.countDocuments({ status: 'Spoofed' });
    const legitCount = await packetCollection.countDocuments({ status: 'Legit' });
    
    // Get top source IPs for spoofed packets
    const topSourceIps = await packetCollection.aggregate([
      { $match: { status: 'Spoofed' } },
      { $group: { _id: '$sourceIp', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    // Get most recent packets
    const recentPackets = await packetCollection
      .find({})
      .sort({ _id: -1 })
      .limit(5)
      .toArray();
    
    res.json({
      total: totalCount,
      spoofed: spoofedCount,
      legitimate: legitCount,
      spoofPercentage: totalCount > 0 ? (spoofedCount / totalCount * 100).toFixed(1) : 0,
      topSourceIps: topSourceIps.map(item => ({
        ip: item._id,
        count: item.count
      })),
      recentPackets
    });
  } catch (error) {
    console.error('Error fetching summary data:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not fetch summary data'
    });
  }
});

/**
 * @route   GET /api/reports/search
 * @desc    Search for packets by IP address
 * @access  Private
 */
router.get('/search', async (req, res) => {
  try {
    const { ip } = req.query;
    if (!ip) {
      return res.status(400).json({
        success: false,
        error: 'IP address is required for search'
      });
    }
    
    const networkDb = mongoose.connection.useDb(MONGO_DB);
    const packetCollection = networkDb.collection(MONGO_COLLECTION);
    
    // Search for packets containing the IP address in source or destination
    const packets = await packetCollection.find({
      $or: [
        { sourceIp: { $regex: ip, $options: 'i' } },
        { destinationIp: { $regex: ip, $options: 'i' } }
      ]
    }).sort({ _id: -1 }).limit(200).toArray();
    
    res.json(packets);
  } catch (error) {
    console.error('Error searching for packets:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not search for packets'
    });
  }
});

module.exports = router;
