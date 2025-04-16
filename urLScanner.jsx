// src/pages/UrlScanner.jsx
import { useState } from 'react';

const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsScanning(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock scan results
      const mockResults = {
        url: url,
        safetyScore: 0,
        verdict: 'Unknown',
        warnings: [],
        details: []
      };
      
      // Determine safety based on URL content
      if (url.includes('https://')) {
        mockResults.safetyScore += 30;
      } else {
        mockResults.warnings.push('Not using HTTPS encryption');
      }
      
      if (!url.includes('suspicious') && !url.includes('scam') && !url.includes('free')) {
        mockResults.safetyScore += 30;
      } else {
        mockResults.warnings.push('URL contains suspicious keywords');
      }
      
      if (url.includes('google.com') || url.includes('microsoft.com') || url.includes('amazon.com')) {
        mockResults.safetyScore += 40;
      } else if (url.includes('.org') || url.includes('.edu') || url.includes('.gov')) {
        mockResults.safetyScore += 30;
      } else {
        mockResults.safetyScore += 20;
      }
      
      // Set verdict based on score
      if (mockResults.safetyScore >= 80) {
        mockResults.verdict = 'Safe';
      } else if (mockResults.safetyScore >= 50) {
        mockResults.verdict = 'Potentially Safe';
      } else if (mockResults.safetyScore >= 30) {
        mockResults.verdict = 'Suspicious';
      } else {
        mockResults.verdict = 'Dangerous';
      }
      
      // Add details
      mockResults.details = [
        { name: 'Domain Age', value: '3 years, 2 months' },
        { name: 'SSL Certificate', value: url.includes('https') ? 'Valid' : 'Not Present' },
        { name: 'Blacklist Status', value: mockResults.safetyScore < 30 ? 'Listed on 2 blacklists' : 'Not Blacklisted' },
        { name: 'Redirect Count', value: '0' },
      ];
      
      setResults(mockResults);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <h1 className="text-2xl font-bold text-cyber-neon">URL Scanner</h1>
        <p className="text-cyber-neon/70">Check if a website or link is safe before visiting</p>
      </div>
      
      {/* URL Input Form */}
      <div className="cyber-card">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            className="cyber-input flex-1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g., https://example.com)"
            required
          />
          <button
            type="submit"
            className="cyber-button whitespace-nowrap"
            disabled={isScanning || !url.trim()}
          >
            {isScanning ? (
              <span className="inline-block animate-pulse">SCANNING...</span>
            ) : (
              <span>SCAN URL</span>
            )}
          </button>
        </form>
      </div>
      
      {/* Results Section */}
      {isScanning && (
        <div className="cyber-card flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-cyber-neon/30 border-t-cyber-neon rounded-full animate-spin mb-4"></div>
          <p className="text-cyber-neon animate-pulse">SCANNING URL...</p>
          <p className="text-cyber-neon/50 text-sm mt-2">Checking reputation databases and analyzing content</p>
        </div>
      )}
      
      {results && !isScanning && (
        <div className="cyber-card">
          <h2 className="text-lg font-bold text-cyber-neon mb-4">Scan Results</h2>
          
          <div className="mb-6 flex items-center">
            <div className="text-4xl mr-4">
              {results.verdict === 'Safe' && '🟢'}
              {results.verdict === 'Potentially Safe' && '🟡'}
              {results.verdict === 'Suspicious' && '🟠'}
              {results.verdict === 'Dangerous' && '🔴'}
            </div>
            <div>
              <div className="text-xl font-bold">
                <span className={
                  results.verdict === 'Safe' ? 'text-cyber-success' :
                  results.verdict === 'Potentially Safe' ? 'text-cyber-warning' :
                  results.verdict === 'Suspicious' ? 'text-cyber-warning' :
                  'text-cyber-danger'
                }>
                  {results.verdict}
                </span>
              </div>
              <div className="text-sm text-cyber-neon/70">
                Safety Score: {results.safetyScore}/100
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-cyber-neon mb-2">URL:</h3>
            <div className="p-2 bg-cyber-dark/50 rounded font-mono text-sm break-all">
              {results.url}
            </div>
          </div>
          
          {/* Warnings */}
          {results.warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-cyber-neon mb-2">Warnings:</h3>
              <ul className="space-y-2">
                {results.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyber-danger mr-2">⚠️</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Details */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-cyber-neon mb-2">Technical Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.details.map((detail, index) => (
                <div key={index} className="flex justify-between p-2 border border-cyber-neon/20 rounded-md">
                  <span className="text-cyber-neon/70">{detail.name}:</span>
                  <span>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between">
            <button 
              className="cyber-button text-sm py-1"
              onClick={() => setResults(null)}
            >
              SCAN ANOTHER URL
            </button>
            <button className="cyber-button text-sm py-1">
              SAVE REPORT
            </button>
          </div>
        </div>
      )}
      
      {/* Safety Tips */}
      <div className="cyber-card">
        <h2 className="text-lg font-bold text-cyber-neon mb-4">URL Safety Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border border-cyber-neon/20 rounded-md">
            <h3 className="font-bold text-cyber-neon mb-1">Check for HTTPS</h3>
            <p className="text-sm text-cyber-neon/70">
              Secure websites use HTTPS encryption. Look for the padlock icon in your browser.
            </p>
          </div>
          
          <div className="p-3 border border-cyber-neon/20 rounded-md">
            <h3 className="font-bold text-cyber-neon mb-1">Verify Domain Names</h3>
            <p className="text-sm text-cyber-neon/70">
              Check for misspellings or slight variations of legitimate domain names.
            </p>
          </div>
          
          <div className="p-3 border border-cyber-neon/20 rounded-md">
            <h3 className="font-bold text-cyber-neon mb-1">Beware of Shortened URLs</h3>
            <p className="text-sm text-cyber-neon/70">
              URL shorteners can hide malicious destinations. Use a URL expander before clicking.
            </p>
          </div>
          
          <div className="p-3 border border-cyber-neon/20 rounded-md">
            <h3 className="font-bold text-cyber-neon mb-1">Check for Excessive Subdomains</h3>
            <p className="text-sm text-cyber-neon/70">
              Multiple subdomains (e.g., legitimate.company.malicious-site.com) can be a red flag.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlScanner;
