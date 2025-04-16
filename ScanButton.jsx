import React, { useState } from 'react';

const ScanButton = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    setIsScanning(true);
    try {
      // Start scan
      await fetch('http://localhost:5002/api/scan/start', {
        method: 'POST'
      });

      // Poll for results
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch('http://localhost:5002/api/scan/status');
        const statusData = await statusResponse.json();

        if (!statusData.isScanning) {
          clearInterval(pollInterval);
          setIsScanning(false);
          if (onScanComplete) {
            onScanComplete(statusData.results);
          }
        }
      }, 1000);
    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
    }
  };

  return (
    <button
      onClick={startScan}
      disabled={isScanning}
      className={`px-4 py-2 text-sm font-semibold rounded-sm transition-colors ${
        isScanning
          ? 'bg-cyber-neon/20 text-cyber-neon/50 cursor-not-allowed'
          : 'bg-cyber-neon/30 text-cyber-neon hover:bg-cyber-neon/40'
      }`}
    >
      {isScanning ? (
        <div className="flex items-center">
          <span className="mr-2">SCANNING</span>
          <div className="animate-spin h-4 w-4 border-2 border-cyber-neon/50 border-t-cyber-neon rounded-full"></div>
        </div>
      ) : (
        'RUN SECURITY SCAN'
      )}
    </button>
  );
};

export default ScanButton;