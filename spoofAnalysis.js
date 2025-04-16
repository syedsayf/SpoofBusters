// utils/spoofAnalysis.js

const ipUtils = require('./ipUtils');
const spoofConfig = require('../config/spoofConfig');

/**
 * Analyze a network packet for signs of IP spoofing
 * @param {Object} packet - Network packet data
 * @returns {Object} Analysis results with spoofing determination
 */
exports.analyzePacket = (packet) => {
  let isSpoofed = false;
  let confidence = 0;
  let details = [];
  
  // Extract packet data
  const { sourceIp, destinationIp, ttl, protocol, flags, packetSize } = packet;
  
  // 1. Check for private IP in public space
  if (!ipUtils.isPrivateIp(sourceIp) && ipUtils.isPrivateIp(destinationIp)) {
    details.push('Public source IP attempting to access private destination');
    confidence += 25;
  }
  
  // 2. Check for impossible routing within our VMware environment
  if (ipUtils.isInValidSubnet(sourceIp)) {
    // Check if source IP is from a valid subnet but doesn't follow expected routes
    const sourceSubnet = spoofConfig.vmware.validSubnets.find(subnet => 
      ipUtils.isIpInRange(sourceIp, subnet)
    );
    
    const destSubnet = spoofConfig.vmware.validSubnets.find(subnet => 
      ipUtils.isIpInRange(destinationIp, subnet)
    );
    
    if (sourceSubnet && destSubnet) {
      // Check if this route is expected
      const validRoute = spoofConfig.vmware.expectedRoutes.some(route => 
        ipUtils.isIpInRange(sourceIp, route.from) && 
        ipUtils.isIpInRange(destinationIp, route.to)
      );
      
      if (!validRoute) {
        details.push('Unexpected routing path between subnets');
        confidence += 30;
      }
    }
  }
  
  // 3. TTL analysis
  if (ttl) {
    // Most spoofed packets have unusual TTL values
    if (ttl < 20 || ttl > 255) {
      details.push(`Suspicious TTL value: ${ttl}`);
      confidence += 15;
    }
    
    // Check if TTL matches expected OS range
    const inWindowsRange = ttl >= spoofConfig.ttlRanges.windows.min && 
                          ttl <= spoofConfig.ttlRanges.windows.max;
    const inLinuxRange = ttl >= spoofConfig.ttlRanges.linux.min && 
                        ttl <= spoofConfig.ttlRanges.linux.max;
    const inMacRange = ttl >= spoofConfig.ttlRanges.macos.min && 
                      ttl <= spoofConfig.ttlRanges.macos.max;
                      
    if (!inWindowsRange && !inLinuxRange && !inMacRange) {
      details.push('TTL value does not match common OS ranges');
      confidence += 10;
    }
  }
  
  // 4. Protocol-specific checks
  if (protocol === 'TCP' && flags) {
    // Check for impossible TCP flag combinations
    if ((flags.includes('SYN') && flags.includes('FIN')) || 
        (flags.includes('SYN') && flags.includes('RST'))) {
      details.push('Impossible TCP flag combination detected');
      confidence += 40;
    }
    
    // Check for unusual flag combinations
    if (flags.includes('URG') && flags.includes('PSH') && flags.includes('FIN')) {
      details.push('XMAS scan detected (URG+PSH+FIN flags)');
      confidence += 35;
    }
  }
  
  // 5. Check for known bad networks
  const isFromBadNetwork = spoofConfig.knownBadNetworks.some(network => 
    ipUtils.isIpInRange(sourceIp, network)
  );
  
  if (isFromBadNetwork) {
    details.push('Source IP is from known malicious network');
    confidence += 30;
  }
  
  // 6. Check packet size for anomalies
  if (packetSize) {
    if (packetSize < 20 || packetSize > 1500) {
      details.push(`Unusual packet size: ${packetSize} bytes`);
      confidence += 10;
    }
  }
  
  // Determine if packet is spoofed based on confidence threshold
  isSpoofed = confidence >= spoofConfig.thresholds.medium;
  
  return {
    isSpoofed,
    confidence,
    details,
    timestamp: new Date(),
    sourceIp,
    destinationIp,
    protocol,
    ttl
  };
};

/**
 * Analyze a batch of packets for spoofing patterns
 * @param {Array} packets - Array of network packets
 * @returns {Object} Batch analysis results
 */
exports.analyzeBatch = (packets) => {
  const results = packets.map(packet => exports.analyzePacket(packet));
  
  // Look for patterns across multiple packets
  const sourceIps = {};
  const spoofedCount = results.filter(r => r.isSpoofed).length;
  
  // Count occurrences of each source IP
  results.forEach(result => {
    if (!sourceIps[result.sourceIp]) {
      sourceIps[result.sourceIp] = {
        count: 0,
        spoofedCount: 0
      };
    }
    
    sourceIps[result.sourceIp].count++;
    if (result.isSpoofed) {
      sourceIps[result.sourceIp].spoofedCount++;
    }
  });
  
  // Find IPs with high spoofing ratio
  const suspiciousIps = Object.entries(sourceIps)
    .filter(([ip, stats]) => 
      stats.count >= 5 && (stats.spoofedCount / stats.count) >= 0.5
    )
    .map(([ip]) => ip);
  
  return {
    totalPackets: packets.length,
    spoofedPackets: spoofedCount,
    spoofPercentage: (spoofedCount / packets.length) * 100,
    suspiciousIps,
    detailedResults: results
  };
};

/**
 * Create a log entry from packet analysis
 * @param {Object} analysis - Analysis result from analyzePacket
 * @returns {Object} Formatted log entry
 */
exports.createLogEntry = (analysis) => {
  return {
    timestamp: analysis.timestamp,
    sourceIp: analysis.sourceIp,
    destinationIp: analysis.destinationIp,
    protocol: analysis.protocol,
    ttl: analysis.ttl,
    isSpoofed: analysis.isSpoofed,
    spoofConfidence: analysis.confidence,
    analysisDetails: analysis.details.join('; ')
  };
};
