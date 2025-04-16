// ./src/routes/systemStatus.route.js
const express = require('express');
const ping = require('ping');
const router = express.Router();

// Define your server list with names and IPs
const servers = [
  { id: 1, name: "PC-A (user/windows)", ip: "192.168.1.2" },
  { id: 2, name: "Attacker (kali linux)", ip: "192.168.1.3", spoofed: "192.168.200.1" },
  { id: 3, name: "Router eth0 (bridged)", ip: "192.168.100.1" },
  { id: 4, name: "Router eth1", ip: "192.168.1.1" },
  { id: 5, name: "Router eth2", ip: "192.168.20.1" },
  { id: 6, name: "Router eth3", ip: "10.10.10.1" },
  { id: 7, name: "SpoofBuster Web Server", ip: "10.10.10.2" },
  { id: 8, name: "Client Web Server", ip: "192.168.20.2" },
  { id: 9, name: "Admin (windows)", ip: "10.10.10.3" },
];

router.get('/', async (req, res) => {
  try {
    const pingPromises = servers.map(server =>
      ping.promise.probe(server.ip, { timeout: 2 }).then(result => ({
        ...server,
        status: result.alive ? "online" : "offline",
      }))
    );

    const statuses = await Promise.all(pingPromises);
    res.status(200).json({ success: true, data: statuses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
