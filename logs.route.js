const express = require('express');
const router = express.Router();
const { 
  getLogs, 
  ingestLogs, 
  getLogById, 
  getStatistics, 
  getRecentAlerts 
} = require('../controllers/logs.controller');

// Middleware for authentication
const auth = require('../middleware/auth');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// Get all logs
router.get('/', getLogs);

// Get statistics
router.get('/statistics', getStatistics);

// Get recent alerts
router.get('/alerts', getRecentAlerts);

// Get specific log by ID
router.get('/:id', getLogById);

// Ingest logs
router.post('/ingest', ingestLogs);

module.exports = router;
