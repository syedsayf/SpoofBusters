import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Poll scan status while scanning is in progress
  useEffect(() => {
    let statusInterval;
    
    if (isScanning) {
      statusInterval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5002/api/scan/status');
          const data = await response.json();
          
          // Update status message if there's an error
          if (data.error) {
            setError(data.error);
            setIsScanning(false);
            clearInterval(statusInterval);
            return;
          }
          
          // Update scan status
          if (!data.isScanning) {
            setIsScanning(false);
            setResults(data.results);
            setStatusMessage('Scan completed');
            clearInterval(statusInterval);
          }
        } catch (err) {
          setError('Error checking scan status: ' + err.message);
          setIsScanning(false);
          clearInterval(statusInterval);
        }
      }, 1000);
    }
    
    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [isScanning]);

  // Start network scan
  const startScan = async () => {
    setIsScanning(true);
    setStatusMessage('Starting scan...');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5002/api/scan/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setStatusMessage('Scan in progress... Monitoring network for 10 seconds');
      } else {
        setError(data.message || 'Failed to start scan');
        setIsScanning(false);
      }
    } catch (err) {
      setError('Error starting scan: ' + err.message);
      setIsScanning(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cyber-darker overflow-hidden">
      {/* Background Effects */}
      <div className="cyber-grid-bg absolute inset-0"></div>
      <div className="digital-rain absolute inset-0"></div>
      <div className="hex-pattern absolute inset-0"></div>
      <div className="cyber-orbs absolute inset-0"></div>
      <div className="scan-lines absolute inset-0"></div>
      <div className="noise absolute inset-0"></div>
      
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="cyber-card border-cyber-neon/50 border mb-6">
            <h1 className="text-3xl text-cyber-neon mb-4">Network Security Scan</h1>
            <p className="text-cyber-neon/70 mb-6">
              Run a security scan to detect spoofed IP addresses and potential threats in your network.
            </p>
            
            <div className="flex justify-center mb-8">
              <button
                onClick={startScan}
                disabled={isScanning}
                className={`px-6 py-3 font-mono font-bold rounded ${
                  isScanning
                    ? 'bg-cyber-neon/30 text-cyber-neon/50 cursor-not-allowed'
                    : 'bg-cyber-neon/30 text-cyber-neon hover:bg-cyber-neon/40'
                }`}
              >
                {isScanning ? (
                  <div className="flex items-center">
                    <span className="mr-2">SCANNING NETWORK</span>
                    <div className="animate-spin h-5 w-5 border-2 border-cyber-neon/50 border-t-cyber-neon rounded-full"></div>
                  </div>
                ) : (
                  'INITIATE SECURITY SCAN'
                )}
              </button>
            </div>
            
            {statusMessage && (
              <div className="text-cyber-blue text-center mb-4 p-2 bg-cyber-blue/10 border border-cyber-blue/30 rounded">
                {statusMessage}
              </div>
            )}
            
            {error && (
              <div className="text-cyber-danger text-center mb-4 p-2 bg-cyber-danger/10 border border-cyber-danger/30 rounded">
                {error}
              </div>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="cyber-card border-cyber-danger/50 border mb-6">
              <div className="flex items-center mb-4">
                <div className="h-3 w-3 bg-cyber-danger animate-pulse rounded-full mr-2"></div>
                <h2 className="text-2xl text-cyber-danger">Security Threats Detected</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-cyber-neon/20">
                    <tr>
                      <th className="px-4 py-2 text-cyber-neon">Time</th>
                      <th className="px-4 py-2 text-cyber-neon">Source IP</th>
                      <th className="px-4 py-2 text-cyber-neon">Destination IP</th>
                      <th className="px-4 py-2 text-cyber-neon">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b border-cyber-neon/10">
                        <td className="px-4 py-3 text-cyber-neon/70">{result.timestamp}</td>
                        <td className="px-4 py-3 text-cyber-danger">{result.sourceIp}</td>
                        <td className="px-4 py-3 text-cyber-neon/70">{result.destinationIp}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded bg-cyber-danger/20 text-cyber-danger">
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-cyber-neon/70">
                <p>Total threats detected: <span className="text-cyber-danger">{results.length}</span></p>
              </div>
            </div>
          )}
          
          {results.length === 0 && !isScanning && statusMessage && (
            <div className="cyber-card border-cyber-success/50 border">
              <div className="flex items-center mb-4">
                <div className="h-3 w-3 bg-cyber-success rounded-full mr-2"></div>
                <h2 className="text-2xl text-cyber-success">Network Secure</h2>
              </div>
              <p className="text-cyber-neon/70">
                No spoofed IP addresses were detected in your network during the scan.
              </p>
            </div>
          )}
          
          <div className="cyber-card border-cyber-neon/50 border mt-6">
            <h2 className="text-xl text-cyber-neon mb-4">How It Works</h2>
            <div className="text-cyber-neon/70">
              <p className="mb-2">
                The security scanner monitors network packets using Scapy to detect:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>IP spoofing attempts</li>
                <li>ARP poisoning attacks</li>
                <li>Suspicious network traffic</li>
                <li>Potential man-in-the-middle attacks</li>
              </ul>
              <p>
                All suspicious activity is logged and stored for security analysis. For best results, run regular scans or enable continuous monitoring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
