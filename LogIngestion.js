// services/logIngestion.js

const { analyzePacket, createLogEntry } = require('../utils/spoofAnalysis');
const LogEntry = require('../models/LogEntry');

/**
 * Process a single log entry from pfSense or other sources
 * @param {Object} log - Raw log data
 * @param {String} userId - User ID for the log entry
 * @returns {Object} Processed log entry
 */
exports.processLogEntry = async (log, userId) => {
  try {
    // Convert log format to packet format for analysis
    const packet = {
      sourceIp: log.sourceIp,
      destinationIp: log.destinationIp,
      protocol: log.protocol,
      ttl: log.ttl,
      flags: log.flags ? log.flags.split(',') : [],
      packetSize: log.packetSize
    };
    
    // Analyze the packet for spoofing
    const spoofAnalysis = analyzePacket(packet);
    
    // Create log entry with analysis results
    const newLog = await LogEntry.create({
      timestamp: log.timestamp || Date.now(),
      sourceIp: log.sourceIp,
      destinationIp: log.destinationIp,
      protocol: log.protocol || 'OTHER',
      port: log.port,
      flags: log.flags,
      packetSize: log.packetSize,
      ttl: log.ttl,
      isSpoofed: spoofAnalysis.isSpoofed,
      spoofConfidence: spoofAnalysis.confidence,
      analysisDetails: spoofAnalysis.details.join('; '),
      user: userId
    });
    
    return newLog;
  } catch (error) {
    console.error('Error processing log entry:', error);
    throw error;
  }
};

/**
 * Process a batch of logs
 * @param {Array} logs - Array of log entries
 * @param {String} userId - User ID for the log entries
 * @returns {Array} Processed log entries
 */
exports.processBatchLogs = async (logs, userId) => {
  try {
    const processedLogs = [];
    
    for (const log of logs) {
      const processedLog = await exports.processLogEntry(log, userId);
      processedLogs.push(processedLog);
    }
    
    return processedLogs;
  } catch (error) {
    console.error('Error processing batch logs:', error);
    throw error;
  }
};

/**
 * Set up a syslog server to receive logs from pfSense
 * @param {Number} port - Port to listen on
 */
exports.setupSyslogServer = (port = 514) => {
  const dgram = require('dgram');
  const server = dgram.createSocket('udp4');
  
  server.on('error', (err) => {
    console.error(`Syslog server error: ${err.message}`);
    server.close();
  });
  
  server.on('message', (msg, rinfo) => {
    try {
      console.log(`Received log from ${rinfo.address}:${rinfo.port}`);
      
      // Parse syslog message
      const logMessage = msg.toString();
      
      // Example parsing for pfSense format
      // This will need to be adjusted based on your actual log format
      const match = logMessage.match(/(\S+) (\S+) (\S+): (.+)/);
      if (match) {
        const [_, timestamp, host, program, content] = match;
        
        // Parse firewall log content
        if (program === 'filterlog') {
          const parts = content.split(',');
          
          // Example pfSense filterlog format parsing
          // Format varies, so adjust according to your actual logs
          const log = {
            timestamp: new Date(timestamp),
            sourceIp: parts[19] || '',
            destinationIp: parts[20] || '',
            protocol: parts[17] || '',
            ttl: parseInt(parts[18]) || 0,
            flags: parts[21] || '',
            packetSize: parseInt(parts[16]) || 0
          };
          
          // Process the log asynchronously
          // Note: You'll need to determine the user ID somehow
          const defaultUserId = process.env.DEFAULT_USER_ID;
          exports.processLogEntry(log, defaultUserId)
            .catch(err => console.error('Error processing syslog entry:', err));
        }
      }
    } catch (error) {
      console.error('Error handling syslog message:', error);
    }
  });
  
  server.on('listening', () => {
    const address = server.address();
    console.log(`Syslog server listening on ${address.address}:${address.port}`);
  });
  
  // Bind to all interfaces
  server.bind(port);
  
  return server;
};
