// controllers/logs.controller.js

const LogEntry = require('../models/LogEntry');
const { processBatchLogs } = require('../services/logIngestion');

// @desc    Ingest logs from client
// @route   POST /api/logs/ingest
// @access  Private
exports.ingestLogs = async (req, res, next) => {
  try {
    const logs = req.body.logs;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No logs provided or invalid format'
      });
    }

    // Process the logs
    const processedLogs = await processBatchLogs(logs, req.user.id);

    res.status(201).json({
      success: true,
      count: processedLogs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all logs for a user
// @route   GET /api/logs
// @access  Private
exports.getLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const filter = { user: req.user.id };

    const logs = await LogEntry.find(filter)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await LogEntry.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get statistics and summary of spoofing attempts
// @route   GET /api/logs/statistics
// @access  Private
exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await LogEntry.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          spoofedCount: {
            $sum: { $cond: [{ $eq: ["$isSpoofed", true] }, 1, 0] }
          },
          avgConfidence: { $avg: "$spoofConfidence" },
          protocolStats: {
            $push: {
              protocol: "$protocol",
              isSpoofed: "$isSpoofed"
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get details of a specific log entry
// @route   GET /api/logs/:id
// @access  Private
exports.getLogById = async (req, res, next) => {
  try {
    const log = await LogEntry.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent spoofing alerts
// @route   GET /api/logs/alerts
// @access  Private
exports.getRecentAlerts = async (req, res, next) => {
  try {
    const alerts = await LogEntry.find({
      user: req.user.id,
      isSpoofed: true,
      spoofConfidence: { $gte: 75 }
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('timestamp sourceIp destinationIp protocol spoofConfidence analysisDetails');

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
