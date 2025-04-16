// spoofbusters-backend/src/routes/settings.route.js
const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.route('/')
  .get(getSettings)
  .put(updateSettings);

module.exports = router;
