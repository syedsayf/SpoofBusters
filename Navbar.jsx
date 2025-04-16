// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Security scan completed", time: "10 minutes ago", read: false },
    { id: 2, message: "System update available", time: "1 hour ago", read: false },
    { id: 3, message: "Backup completed successfully", time: "3 hours ago", read: true }
  ]);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login');
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking elsewhere
  const handleClickOutside = () => {
    if (showNotifications) setShowNotifications(false);
    if (showDropdown) setShowDropdown(false);
  };

  return (
    <nav className="bg-cyber-dark/80 backdrop-blur-sm border-b border-cyber-neon/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-cyber-neon text-xl font-bold">
              SPOOFBUSTERS
            </Link>
            
            {/* Navigation Dropdown - Now on the left */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                  if (showNotifications) setShowNotifications(false);
                }}
                className="text-cyber-neon hover:text-cyber-blue transition-colors"
                title="Navigation Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-cyber-dark border border-cyber-neon/30 shadow-lg rounded-sm z-50">
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-cyber-neon hover:bg-cyber-neon/10"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/scan" 
                    className="block px-4 py-2 text-cyber-neon hover:bg-cyber-neon/10"
                    onClick={() => setShowDropdown(false)}
                  >
                    Scan
                  </Link>
                  <Link 
                    to="/reports" 
                    className="block px-4 py-2 text-cyber-neon hover:bg-cyber-neon/10"
                    onClick={() => setShowDropdown(false)}
                  >
                    Reports
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-cyber-neon hover:bg-cyber-neon/10"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  if (showDropdown) setShowDropdown(false);
                }}
                className="text-cyber-neon hover:text-cyber-blue transition-colors relative"
                title="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-cyber-danger animate-pulse"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-cyber-dark border border-cyber-neon/30 shadow-lg rounded-sm z-50">
                  <div className="p-3 border-b border-cyber-neon/20">
                    <h3 className="text-cyber-neon font-bold">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-cyber-neon/10 hover:bg-cyber-neon/5 ${!notification.read ? 'bg-cyber-neon/10' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <p className="text-cyber-neon/80">{notification.message}</p>
                          <p className="text-cyber-blue/50 text-xs mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-cyber-neon/50">
                        No new notifications
                      </div>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <div className="p-2 text-center border-t border-cyber-neon/20">
                      <button 
                        className="text-cyber-blue text-sm hover:text-cyber-neon"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Power/Logout Button */}
            <button 
              onClick={handleLogout}
              className="text-cyber-red hover:text-cyber-pink transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
