// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import NetworkTrafficChart from "../components/NetworkTrafficChart";
import ScanButton from "../components/ScanButton";

const Dashboard = () => {
  const [username, setUsername] = useState("User");
  const [networkData, setNetworkData] = useState(null);
  const [servers, setServers] = useState([]);
  const [uptime, setUptime] = useState("N/A");
  const [scanResults, setScanResults] = useState([]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "System scan completed", time: "10 minutes ago" },
    { id: 2, action: "Security update installed", time: "1 hour ago" },
    {
      id: 3,
      action: "User login detected",
      time: localStorage.getItem("lastLogin"),
    },
  ]);

  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 1,
      level: "low",
      message: "Unusual login attempt blocked",
      time: "3 hours ago",
    },
    {
      id: 2,
      level: "medium",
      message: "Potential phishing attempt detected",
      time: "1 day ago",
    },
  ]);

  const handleScanComplete = (results) => {
    setScanResults(results);
    // Add scan completion to recent activities
    setRecentActivities(prev => [{
      id: Date.now(),
      action: `Scan completed - Found ${results.length} suspicious IPs`,
      time: "Just now"
    }, ...prev.slice(0, 4)]);

    // Update security alerts if spoofed IPs found
    if (results.length > 0) {
      setSecurityAlerts(prev => [{
        id: Date.now(),
        level: "high",
        message: `Detected ${results.length} spoofed IP addresses`,
        time: "Just now"
      }, ...prev.slice(0, 4)]);
    }
  };

  // Fetch current user info from the backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("/api/auth/me", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      return res.json();
    })
    .then((data) => {
      if (data.success && data.data) {
        setUsername(data.data.username);
      }
    })
    .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const res = await fetch("/api/system-status");
        const data = await res.json();
        if (data.success) {
          setServers(data.data);
        }
      } catch (err) {
        console.error("Error fetching system status:", err);
      }
    };

    fetchSystemStatus();
    // Optionally, poll periodically if statuses can change:
    const interval = setInterval(fetchSystemStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real network traffic data from your backend
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("/api/network/traffic", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setNetworkData(result.data);
        }
      } catch (err) {
        console.error("Error fetching network data:", err);
      }
    };

    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUptime = async () => {
      try {
        const res = await fetch("/api/system-uptime");
        const result = await res.json();
        if (result.success) {
          setUptime(result.uptime);
        }
      } catch (err) {
        console.error("Error fetching system uptime:", err);
      }
    };
    fetchUptime();
    const interval = setInterval(fetchUptime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

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
          <div className="cyber-card mb-6 border-cyber-neon/50 border">
            <h1 className="text-3xl text-cyber-neon mb-2">
              Welcome, <span className="text-cyber-blue">{username}</span>
            </h1>
            <p className="text-cyber-neon/70">
              Security system is active and monitoring for threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* System Status */}
            {/* System Status */}
            <div className="cyber-card border-cyber-neon/50 border">
              <h2 className="text-xl text-cyber-neon mb-4">System Status</h2>
              <div className="space-y-3">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-cyber-neon/70">{server.name}</span>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 ${
                          server.status === "online"
                            ? "text-cyber-success"
                            : "text-cyber-danger"
                        }`}
                      >
                        {server.status === "online" ? "ONLINE" : "OFFLINE"}
                      </span>
                      <div
                        className={`h-3 w-3 rounded-full ${
                          server.status === "online"
                            ? "bg-cyber-success"
                            : "bg-cyber-danger"
                        } animate-pulse`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-cyber-neon/20">
                <div className="flex justify-between items-center">
                  <span className="text-cyber-neon/70">System Uptime</span>
                  <span className="text-cyber-success">{uptime}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="cyber-card border-cyber-neon/50 border">
              <h2 className="text-xl text-cyber-neon mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-b border-cyber-neon/20 pb-2 last:border-0"
                  >
                    <p className="text-cyber-neon/70">{activity.action}</p>
                    <p className="text-cyber-blue/50 text-sm">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-2">
                <button className="text-cyber-neon hover:text-cyber-blue text-sm">
                  VIEW ALL ACTIVITY →
                </button>
              </div>
            </div>

            {/* Security Alerts */}
            <div className="cyber-card border-cyber-neon/50 border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-cyber-neon">Security Alerts</h2>
                <ScanButton onScanComplete={handleScanComplete} />
              </div>
              {securityAlerts.length > 0 ? (
                <div className="space-y-3">
                  {securityAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="border-b border-cyber-neon/20 pb-2 last:border-0"
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full mr-2 ${
                            alert.level === "high"
                              ? "bg-cyber-danger"
                              : alert.level === "medium"
                              ? "bg-cyber-warning"
                              : "bg-cyber-success"
                          }`}
                        ></div>
                        <p
                          className={`${
                            alert.level === "high"
                              ? "text-cyber-danger"
                              : alert.level === "medium"
                              ? "text-cyber-warning"
                              : "text-cyber-success"
                          }`}
                        >
                          {alert.level.toUpperCase()} ALERT
                        </p>
                      </div>
                      <p className="text-cyber-neon/70 mt-1">{alert.message}</p>
                      <p className="text-cyber-blue/50 text-sm">{alert.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-cyber-success">No active security alerts</p>
              )}
              <div className="mt-4 pt-2">
                <button className="text-cyber-neon hover:text-cyber-blue text-sm">
                  RUN SECURITY SCAN →
                </button>
              </div>
            </div>
          </div>

          {/* Network Traffic */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetworkTrafficChart />

            {/* Threat Detection */}
            <div className="cyber-card border-cyber-neon/50 border">
              <h2 className="text-xl text-cyber-neon mb-4">Threat Detection</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyber-neon/70">Malware Blocked</span>
                  <span className="text-cyber-success">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyber-neon/70">Phishing Attempts</span>
                  <span className="text-cyber-success">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyber-neon/70">Suspicious Logins</span>
                  <span className="text-cyber-warning">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyber-neon/70">Data Breaches</span>
                  <span className="text-cyber-success">0</span>
                </div>
                {scanResults.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-cyber-neon/20">
                    <h3 className="text-cyber-danger mb-2">Latest Scan Results</h3>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {scanResults.map((result, index) => (
                        <div key={index} className="text-sm text-cyber-neon/70">
                          <span className="text-cyber-danger">⚠️ </span>
                          {result.sourceIp} → {result.destinationIp}
                          <span className="text-cyber-blue/50 ml-2">{result.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-2 border-t border-cyber-neon/20">
                <p className="text-cyber-success">System protection active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
