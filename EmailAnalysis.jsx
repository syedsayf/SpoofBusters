// src/pages/EmailAnalysis.jsx
import { useState } from 'react';

const EmailAnalysis = () => {
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock analysis results
      const mockResults = {
        score: 85,
        verdict: emailContent.includes('urgent') || emailContent.includes('password') ? 'Suspicious' : 'Clean',
        warnings: [],
        details: []
      };
      
      // Add warnings based on content
      if (emailContent.toLowerCase().includes('urgent')) {
        mockResults.warnings.push('Contains urgency language often used in phishing');
        mockResults.score -= 20;
      }
      
      if (emailContent.toLowerCase().includes('password')) {
        mockResults.warnings.push('Requests password or sensitive information');
        mockResults.score -= 30;
      }
      
      if (emailContent.toLowerCase().includes('click')) {
        mockResults.warnings.push('Contains link with suspicious text');
        mockResults.score -= 15;
      }
      
      // Update verdict based on score
      if (mockResults.score < 50) {
        mockResults.verdict = 'Malicious';
      } else if (mockResults.score < 80) {
        mockResults.verdict = 'Suspicious';
      }
      
      // Add details
      mockResults.details = [
        { name: 'Sender Reputation', value: mockResults.score > 70 ? 'Good' : 'Poor' },
        { name: 'Link Safety', value: emailContent.includes('http') ? 'Unchecked Links Present' : 'No Links' },
        { name: 'Attachment', value: 'None Detected' },
        { name: 'Grammar Quality', value: mockResults.score > 60 ? 'Good' : 'Poor' },
      ];
      
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card">
        <h1 className="text-2xl font-bold text-cyber-neon">Email Analysis</h1>
        <p className="text-cyber-neon/70">Paste an email to analyze it for potential threats</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Input Form */}
        <div className="cyber-card">
          <h2 className="text-lg font-bold text-cyber-neon mb-4">Email Content</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                className="cyber-input w-full h-64 font-mono"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste email content here including headers..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="cyber-button w-full"
              disabled={isAnalyzing || !emailContent.trim()}
            >
              {isAnalyzing ? (
                <span className="inline-block animate-pulse">ANALYZING...</span>
              ) : (
                <span>ANALYZE EMAIL</span>
              )}
            </button>
          </form>
          
          <div className="mt-4 text-sm text-cyber-neon/70">
            <h3 className="font-bold mb-2">How to use:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the entire email content including headers</li>
              <li>Paste it into the text area above</li>
              <li>Click "Analyze Email" to scan for threats</li>
            </ol>
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="cyber-card">
          <h2 className="text-lg font-bold text-cyber-neon mb-4">Analysis Results</h2>
          
          {!results && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-64 text-cyber-neon/50">
              <div className="text-4xl mb-2">🔍</div>
              <p>Email analysis results will appear here</p>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-cyber-neon/30 border-t-cyber-neon rounded-full animate-spin mb-4"></div>
              <p className="text-cyber-neon animate-pulse">ANALYZING EMAIL CONTENT...</p>
            </div>
          )}
          
          {results && !isAnalyzing && (
            <div>
              {/* Verdict */}
              <div className="mb-6 text-center">
                <div className="text-6xl mb-2">
                  {results.verdict === 'Clean' && '✅'}
                  {results.verdict === 'Suspicious' && '⚠️'}
                  {results.verdict === 'Malicious' && '🚫'}
                </div>
                <div className="text-2xl font-bold mb-1">
                  <span className={
                    results.verdict === 'Clean' ? 'text-cyber-success' :
                    results.verdict === 'Suspicious' ? 'text-cyber-warning' :
                    'text-cyber-danger'
                  }>
                    {results.verdict}
                  </span>
                </div>
                <div className="text-sm text-cyber-neon/70">
                  Trust Score: {results.score}/100
                </div>
              </div>
              
              {/* Warnings */}
              {results.warnings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-cyber-neon mb-2">Warnings Detected:</h3>
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
              <div>
                <h3 className="text-sm font-bold text-cyber-neon mb-2">Analysis Details:</h3>
                <div className="space-y-2">
                  {results.details.map((detail, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-cyber-neon/70">{detail.name}:</span>
                      <span>{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-cyber-neon/20 flex justify-between">
                <button className="cyber-button text-sm py-1">
                  SAVE REPORT
                </button>
                <button 
                  className="cyber-button text-sm py-1"
                  onClick={() => setResults(null)}
                >
                  NEW ANALYSIS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="cyber-card">
        <h2 className="text-lg font-bold text-cyber-neon mb-4">Email Security Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border border-cyber-neon/20 rounded-md">
            <h3 className="font-bold text-cyber-neon mb-1">Check the Sender</h3>
            <p className="text-sm text-cyber-neon/70">
              Verify the email address is legitimate and not a slight variation of a known contact.
            </p>
          </div>
          
          <div className="p-3 border border-cyber-neon/20 rounded-md">
            <h3 className="font-bold text-cyber-neon mb-1">Beware of Urgency</h3>
            <p className="text-sm text-cyber-neon/70">
              Phishing emails often create a false sense of urgency to prompt immediate action.
            </p>
          </div>
          
          <div className="p-3 border border-cyber-neon/20 rounded-md">
            <h3 className="font-bold text-cyber-neon mb-1">Hover Before Clicking</h3>
            <p className="text-sm text-cyber-neon/70">
              Always hover over links to verify they lead to legitimate websites before clicking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAnalysis;
