// ipUtils.js - Updated with your specific subnets

const ipRangeCheck = require('ip-range-check');

// Define valid subnets for your VMware environment
const VALID_SUBNETS = [
  '192.168.1.0/24',
  '192.168.20.0/24',
  '10.10.10.0/24',
  '10.99.99.0/24'
];

/**
 * Check if an IP is within a CIDR range
 * @param {string} ip - The IP address to check
 * @param {string} cidr - The CIDR range (e.g., "192.168.0.0/24")
 * @returns {boolean} - True if IP is in range
 */
exports.isIpInRange = (ip, cidr) => {
  return ipRangeCheck(ip, cidr);
};

/**
 * Check if an IP is a private address
 * @param {string} ip - The IP address to check
 * @returns {boolean} - True if IP is private
 */
exports.isPrivateIp = (ip) => {
  return ipRangeCheck(ip, [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
    '127.0.0.0/8'
  ]);
};

/**
 * Check if an IP is in our valid VMware subnets
 * @param {string} ip - The IP address to check
 * @returns {boolean} - True if IP is in valid subnets
 */
exports.isInValidSubnet = (ip) => {
  return ipRangeCheck(ip, VALID_SUBNETS);
};

/**
 * Extract the real client IP from request headers
 * @param {object} req - Express request object
 * @returns {string} - The client IP address
 */
exports.getClientIp = (req) => {
  // Check for proxy headers first
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // Get the first IP in the list (client IP)
    return xForwardedFor.split(',')[0].trim();
  }
  
  // Fall back to standard request IP
  return req.ip || req.connection.remoteAddress;
};

/**
 * Determine if traffic is internal (within our VMware environment)
 * @param {string} sourceIp - Source IP address
 * @param {string} destIp - Destination IP address
 * @returns {boolean} - True if traffic is internal
 */
exports.isInternalTraffic = (sourceIp, destIp) => {
  return exports.isInValidSubnet(sourceIp) && exports.isInValidSubnet(destIp);
};

/**
 * Test connectivity to pfSense and network configuration
 */
exports.testVMwareConnectivity = async () => {
  try {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    const validInterfaces = [];
    
    // Find interfaces in our valid subnets
    for (const [name, addrs] of Object.entries(interfaces)) {
      for (const addr of addrs) {
        if (addr.family === 'IPv4' && exports.isInValidSubnet(addr.address)) {
          validInterfaces.push({
            name,
            address: addr.address,
            subnet: VALID_SUBNETS.find(subnet => 
              ipRangeCheck(addr.address, subnet)
            )
          });
        }
      }
    }
    
    return {
      validSubnets: VALID_SUBNETS,
      validInterfaces,
      hostname: os.hostname(),
      status: validInterfaces.length > 0 ? 'connected' : 'not_connected'
    };
  } catch (error) {
    return {
      error: error.message,
      status: 'failed'
    };
  }
};
