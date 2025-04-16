import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/reports', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        
        // Process data to ensure consistent format between MongoDB and JSON sources
        const formattedReports = res.data.map(report => ({
          _id: report._id,
          sourceIp: report.sourceIp || report.source_ip,
          destinationIp: report.destinationIp || report.destination_ip,
          timestamp: report.timestamp,
          status: report.status || (report.isSpoofed ? 'Spoofed' : 'Legitimate')
        }));
        
        setReports(formattedReports);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Error fetching reports: ' + err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Format the ObjectId to string
  const formatId = (id) => {
    if (!id) return 'N/A';
    return typeof id === 'object' && id.$oid ? id.$oid : id.toString();
  };

  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      // Check if timestamp is already in HH:MM:SS format
      if (/^\d{2}:\d{2}:\d{2}$/.test(timestamp)) {
        return timestamp;
      }
      // If it's just HH:MM format
      if (/^\d{2}:\d{2}$/.test(timestamp)) {
        return timestamp + ':00';
      }
      // Try to parse as ISO date
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString();
      }
      // Return original if parsing fails
      return timestamp;
    } catch (e) {
      return timestamp;
    }
  };

  const filteredReports = reports.filter(report => {
    const sourceIp = report.sourceIp || '';
    const destinationIp = report.destinationIp || '';
    
    const matchesSearch = searchTerm === '' || 
      sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destinationIp.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

    let matchesTime = true;
    if (timeFilter !== 'all') {
      const reportTime = new Date(report.timestamp).getTime();
      const now = new Date().getTime();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      switch (timeFilter) {
        case 'today':
          matchesTime = now - reportTime < dayInMs;
          break;
        case 'week':
          matchesTime = now - reportTime < 7 * dayInMs;
          break;
        case 'month':
          matchesTime = now - reportTime < 30 * dayInMs;
          break;
        default:
          matchesTime = true;
      }
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl text-cyber-neon">Network Traffic Analysis</h1>
          </div>

          {/* Search and Filter Controls */}
          <div className="cyber-card border-cyber-neon/50 border mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search by IP address..."
                  className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Spoofed">Spoofed</option>
                  <option value="Legitimate">Legitimate</option>
                </select>
              </div>
              <div>
                <select
                  className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Last 24 Hours</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="flex justify-center items-center space-x-3">
                <div className="text-cyber-neon font-mono text-xl animate-blink">Scanning Network</div>
                <div className="h-2 w-2 rounded-full bg-cyber-neon animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-cyber-neon animate-pulse animation-delay-200"></div>
                <div className="h-2 w-2 rounded-full bg-cyber-neon animate-pulse animation-delay-400"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-cyber-danger text-center p-4">{error}</div>
          ) : (
            <div className="cyber-card border-cyber-neon/50 border mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-cyber-neon/20">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyber-neon uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyber-neon uppercase tracking-wider">Source IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyber-neon uppercase tracking-wider">Destination IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-cyber-neon uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-neon/10">
                    {filteredReports.map((report, index) => (
                      <tr key={formatId(report._id) + '-' + index} className="hover:bg-cyber-neon/5">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-neon">
                          {formatTimestamp(report.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-neon/70">
                          {report.sourceIp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-neon/70">
                          {report.destinationIp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm ${
                            report.status === 'Spoofed' ? 'bg-cyber-danger/20 text-cyber-danger' : 'bg-cyber-success/20 text-cyber-success'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredReports.length === 0 && (
                  <div className="text-center py-4 text-cyber-neon/70">
                    No reports match the selected filters
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
