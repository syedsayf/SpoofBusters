const geoip = require('geoip-lite');

/**
 * Middleware to detect potential IP spoofing in real-time
 * This can be used on specific routes that need immediate protection
 */
exports.detectSpoofing = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    let isSpoofed = false;
    let reason = '';

    // 1. Check if IP is in private range but coming from public internet
    if ((ip.startsWith('10.') || 
         ip.startsWith('192.168.') || 
         ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) && 
        req.headers['x-forwarded-for']) {
      isSpoofed = true;
      reason = 'Private IP address coming from public internet';
    }

    // 2. Check for mismatched geolocation
    const geo = geoip.lookup(ip);
    if (geo) {
      // Example: If you know your users should be from specific countries
      const allowedCountries = ['US', 'CA', 'GB']; // Example list
      if (!allowedCountries.includes(geo.country)) {
        // This is just a flag, not necessarily spoofing
        req.suspiciousLocation = true;
      }
    }

    // 3. Check for known proxy/VPN
    // This would typically use a third-party API or database
    // For example purposes, we'll just check a few known proxy ranges
    if (ip.startsWith('104.16.') || ip.startsWith('104.17.')) {
      req.potentialProxy = true;
    }

    // If spoofing is detected, you can either block or flag the request
    if (isSpoofed) {
      req.isSpoofed = true;
      req.spoofReason = reason;
      
      // Option 1: Block the request
      // return res.status(403).json({
      //   success: false,
      //   message: 'Potential IP spoofing detected'
      // });
      
      // Option 2: Flag the request but allow it to proceed
      console.warn(`Potential IP spoofing detected from ${ip}: ${reason}`);
    }

    next();
  } catch (error) {
    console.error('Error in spoofing detection middleware:', error);
    next();
  }
};
