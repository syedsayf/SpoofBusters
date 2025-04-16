// spoofbusters-backend/src/controllers/settings.controller.js
const Settings = require('../models/Settings');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.id });

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        user: req.user.id,
        notifications: {
          email: true,
          browser: true,
          events: {
            scanComplete: true,
            threatDetected: true,
            weeklyReport: false
          }
        },
        security: {
          enable2FA: false
        }
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
