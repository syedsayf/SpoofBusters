// src/components/CyberLayout.jsx
import React from 'react';

const CyberLayout = ({ children }) => {
  console.log("CyberLayout rendering", children); // Add this for debugging
  
  return (
    <div className="relative min-h-screen bg-cyber-darker overflow-hidden">
      {/* Background Effects - these are absolutely positioned */}
      <div className="cyber-grid-bg absolute inset-0"></div>
      <div className="digital-rain absolute inset-0"></div>
      <div className="hex-pattern absolute inset-0"></div>
      <div className="cyber-orbs absolute inset-0"></div>
      <div className="scan-lines absolute inset-0"></div>
      <div className="noise absolute inset-0"></div>
      
      {/* Content - positioned above the background with z-index */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default CyberLayout;
