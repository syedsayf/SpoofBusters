module.exports = {
    // Confidence thresholds
    thresholds: {
      low: 30,
      medium: 50,
      high: 75
    },
    
    // Default TTL ranges for common operating systems
    ttlRanges: {
      windows: { min: 64, max: 128 },
      linux: { min: 64, max: 64 },
      macos: { min: 64, max: 64 }
    },
    
    // Known bad actor networks (example)
    knownBadNetworks: [
      '185.156.73.0/24',
      '193.38.54.0/24'
    ],
    
    // API keys and external service configuration
    services: {
      abuseipdb: {
        apiKey: process.env.ABUSEIPDB_API_KEY,
        confidenceThreshold: 50
      },
      ipqualityscore: {
        apiKey: process.env.IPQUALITYSCORE_API_KEY
      }
    }
  };
  