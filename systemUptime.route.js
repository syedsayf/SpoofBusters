// ./src/routes/systemUptime.route.js
const express = require('express');
const os = require('os');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    // os.uptime() returns the uptime in seconds
    const uptimeSeconds = os.uptime();

    // Format uptime to a human-friendly string (hours, minutes, seconds)
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const formattedUptime = `${hours}h ${minutes}m ${seconds}s`;

    res.status(200).json({ success: true, uptime: formattedUptime });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
