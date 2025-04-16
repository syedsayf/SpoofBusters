// src/pages/Settings.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      scanComplete: true,
      threatDetected: true,
      weeklyReport: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      ipRestriction: false,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    display: {
      theme: 'cyber',
      animationLevel: 'full',
      darkMode: true,
      highContrast: false,
      fontSize: 'medium'
    },
    account: {
      email: 'user@example.com',
      apiKey: 'sk_test_abcdefghijklmnopqrstuvwxyz',
      username: localStorage.getItem('username') || 'User',
      plan: 'Professional'
    }
  });
  
  const [activeTab, setActiveTab] = useState('notifications');
  const [saveStatus, setSaveStatus] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const handleChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };
  
  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };
  
  const regenerateApiKey = () => {
    // Generate a random API key
    const newApiKey = 'sk_test_' + Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    
    handleChange('account', 'apiKey', newApiKey);
    setSaveStatus('apiKeyChanged');
    setTimeout(() => setSaveStatus(''), 2000);
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

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto p-4">
          <h1 className="text-3xl text-cyber-neon mb-6">Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="cyber-card border-cyber-neon/50 border h-fit">
              <h2 className="text-xl text-cyber-neon mb-4">Configuration</h2>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-sm ${activeTab === 'notifications' ? 'bg-cyber-neon/10 text-cyber-neon' : 'text-cyber-neon/70 hover:bg-cyber-neon/5'}`}
                >
                  Notifications
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-sm ${activeTab === 'security' ? 'bg-cyber-neon/10 text-cyber-neon' : 'text-cyber-neon/70 hover:bg-cyber-neon/5'}`}
                >
                  Security
                </button>
                <button 
                  onClick={() => setActiveTab('display')}
                  className={`w-full text-left px-3 py-2 rounded-sm ${activeTab === 'display' ? 'bg-cyber-neon/10 text-cyber-neon' : 'text-cyber-neon/70 hover:bg-cyber-neon/5'}`}
                >
                  Display
                </button>
                <button 
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-3 py-2 rounded-sm ${activeTab === 'account' ? 'bg-cyber-neon/10 text-cyber-neon' : 'text-cyber-neon/70 hover:bg-cyber-neon/5'}`}
                >
                  Account
                </button>
              </nav>
            </div>
            
            {/* Settings Content */}
            <div className="cyber-card border-cyber-neon/50 border md:col-span-3">
              {activeTab === 'notifications' && (
                <>
                  <h2 className="text-xl text-cyber-neon mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-cyber-neon/70">Email Notifications</label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                          type="checkbox"
                          className="opacity-0 w-0 h-0"
                          checked={settings.notifications.email}
                          onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                        />
                        <span 
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.notifications.email ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                          onClick={() => handleChange('notifications', 'email', !settings.notifications.email)}
                        >
                          <span 
                            className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.notifications.email ? 'left-7' : 'left-1'}`}
                          ></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-cyber-neon/70">Browser Notifications</label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                          type="checkbox"
                          className="opacity-0 w-0 h-0"
                          checked={settings.notifications.browser}
                          onChange={(e) => handleChange('notifications', 'browser', e.target.checked)}
                        />
                        <span 
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.notifications.browser ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                          onClick={() => handleChange('notifications', 'browser', !settings.notifications.browser)}
                        >
                          <span 
                            className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.notifications.browser ? 'left-7' : 'left-1'}`}
                          ></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-cyber-neon/20 pt-4">
                      <h3 className="text-cyber-neon mb-3">Notification Events</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-cyber-neon/70">Scan Complete</label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                            <input
                              type="checkbox"
                              className="opacity-0 w-0 h-0"
                              checked={settings.notifications.scanComplete}
                              onChange={(e) => handleChange('notifications', 'scanComplete', e.target.checked)}
                            />
                            <span 
                              className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.notifications.scanComplete ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                              onClick={() => handleChange('notifications', 'scanComplete', !settings.notifications.scanComplete)}
                            >
                              <span 
                                className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.notifications.scanComplete ? 'left-7' : 'left-1'}`}
                              ></span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-cyber-neon/70">Threat Detected</label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                            <input
                              type="checkbox"
                              className="opacity-0 w-0 h-0"
                              checked={settings.notifications.threatDetected}
                              onChange={(e) => handleChange('notifications', 'threatDetected', e.target.checked)}
                            />
                            <span 
                              className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.notifications.threatDetected ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                              onClick={() => handleChange('notifications', 'threatDetected', !settings.notifications.threatDetected)}
                            >
                              <span 
                                className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.notifications.threatDetected ? 'left-7' : 'left-1'}`}
                              ></span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-cyber-neon/70">Weekly Report</label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                            <input
                              type="checkbox"
                              className="opacity-0 w-0 h-0"
                              checked={settings.notifications.weeklyReport}
                              onChange={(e) => handleChange('notifications', 'weeklyReport', e.target.checked)}
                            />
                            <span 
                              className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.notifications.weeklyReport ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                              onClick={() => handleChange('notifications', 'weeklyReport', !settings.notifications.weeklyReport)}
                            >
                              <span 
                                className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.notifications.weeklyReport ? 'left-7' : 'left-1'}`}
                              ></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'security' && (
                <>
                  <h2 className="text-xl text-cyber-neon mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-cyber-neon/70">Two-Factor Authentication</label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                          type="checkbox"
                          className="opacity-0 w-0 h-0"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
                        />
                        <span 
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.security.twoFactorAuth ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                          onClick={() => handleChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                        >
                          <span 
                            className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.security.twoFactorAuth ? 'left-7' : 'left-1'}`}
                          ></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-cyber-neon/70">IP Restriction</label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                          type="checkbox"
                          className="opacity-0 w-0 h-0"
                          checked={settings.security.ipRestriction}
                          onChange={(e) => handleChange('security', 'ipRestriction', e.target.checked)}
                        />
                        <span 
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.security.ipRestriction ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                          onClick={() => handleChange('security', 'ipRestriction', !settings.security.ipRestriction)}
                        >
                          <span 
                            className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.security.ipRestriction ? 'left-7' : 'left-1'}`}
                          ></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value) || 0)}
                        min="1"
                        max="120"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Password Expiry (days)</label>
                      <input
                        type="number"
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.security.passwordExpiry}
                        onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value) || 0)}
                        min="0"
                        max="365"
                      />
                      <p className="text-cyber-neon/50 text-xs">Set to 0 for no expiry</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Failed Login Attempts Before Lockout</label>
                      <input
                        type="number"
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.security.loginAttempts}
                        onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value) || 0)}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'display' && (
                <>
                  <h2 className="text-xl text-cyber-neon mb-4">Display Settings</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Theme</label>
                      <select
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.display.theme}
                        onChange={(e) => handleChange('display', 'theme', e.target.value)}
                      >
                        <option value="cyber">Cyberpunk</option>
                        <option value="matrix">Matrix</option>
                        <option value="neon">Neon</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Animation Level</label>
                      <select
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.display.animationLevel}
                        onChange={(e) => handleChange('display', 'animationLevel', e.target.value)}
                      >
                        <option value="full">Full</option>
                        <option value="reduced">Reduced</option>
                        <option value="minimal">Minimal</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-cyber-neon/70">Dark Mode</label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                          type="checkbox"
                          className="opacity-0 w-0 h-0"
                          checked={settings.display.darkMode}
                          onChange={(e) => handleChange('display', 'darkMode', e.target.checked)}
                        />
                        <span 
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.display.darkMode ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                          onClick={() => handleChange('display', 'darkMode', !settings.display.darkMode)}
                        >
                          <span 
                            className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.display.darkMode ? 'left-7' : 'left-1'}`}
                          ></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-cyber-neon/70">High Contrast</label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                          type="checkbox"
                          className="opacity-0 w-0 h-0"
                          checked={settings.display.highContrast}
                          onChange={(e) => handleChange('display', 'highContrast', e.target.checked)}
                        />
                        <span 
                          className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${settings.display.highContrast ? 'bg-cyber-neon' : 'bg-cyber-neon/30'}`}
                          onClick={() => handleChange('display', 'highContrast', !settings.display.highContrast)}
                        >
                          <span 
                            className={`absolute h-4 w-4 bg-cyber-darker rounded-full top-1 transition-all duration-300 ${settings.display.highContrast ? 'left-7' : 'left-1'}`}
                          ></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Font Size</label>
                      <select
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.display.fontSize}
                        onChange={(e) => handleChange('display', 'fontSize', e.target.value)}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'account' && (
                <>
                  <h2 className="text-xl text-cyber-neon mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Username</label>
                      <input
                        type="text"
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.account.username}
                        onChange={(e) => handleChange('account', 'username', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Email</label>
                      <input
                        type="email"
                        className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                        value={settings.account.email}
                        onChange={(e) => handleChange('account', 'email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">API Key</label>
                      <div className="flex space-x-2">
                        <input
                          type={showApiKey ? "text" : "password"}
                          className="cyber-input flex-1 bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                                   focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none"
                          value={settings.account.apiKey}
                          readOnly
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="px-3 py-2 bg-cyber-darker border border-cyber-neon/50 text-cyber-neon rounded-sm hover:border-cyber-neon"
                          title={showApiKey ? "Hide API Key" : "Show API Key"}
                        >
                          {showApiKey ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={regenerateApiKey}
                          className="px-3 py-2 bg-cyber-darker border border-cyber-neon/50 text-cyber-neon rounded-sm hover:border-cyber-neon"
                          title="Regenerate API Key"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-cyber-neon/50 text-xs">Use this key to authenticate API requests</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-cyber-neon/70">Current Plan</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-cyber-neon">{settings.account.plan}</span>
                        <button className="text-cyber-blue text-sm hover:text-cyber-neon">
                          Upgrade Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Save Button and Status */}
              <div className="mt-6 pt-6 border-t border-cyber-neon/20 flex items-center justify-between">
                <div>
                  {saveStatus === 'saving' && (
                    <span className="text-cyber-blue animate-pulse">Saving changes...</span>
                  )}
                  {saveStatus === 'saved' && (
                    <span className="text-cyber-success">Changes saved successfully</span>
                  )}
                  {saveStatus === 'apiKeyChanged' && (
                    <span className="text-cyber-warning">API Key regenerated</span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`cyber-button ${saveStatus === 'saving' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saveStatus === 'saving' ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
