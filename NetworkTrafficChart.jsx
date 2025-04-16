// src/components/NetworkTrafficChart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const POLL_INTERVAL = 5000;

const NetworkTrafficChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const prevRx = useRef(0);
  const prevTx = useRef(0);
  const prevTimestamp = useRef(Date.now());

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/network/traffic', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json();
        if (result.success && result.data) {
          const currentRx = result.data.rx_bytes || 0;
          const currentTx = result.data.tx_bytes || 0;
          const currentTime = Date.now();
          const timeDiffSec = (currentTime - prevTimestamp.current) / 1000;

          // Only update if we have valid data
          if (timeDiffSec > 0) {
            const rxRate = (currentRx - prevRx.current) / timeDiffSec;
            const txRate = (currentTx - prevTx.current) / timeDiffSec;

            setData(prevData => {
              const newData = [...prevData, {
                time: new Date().toLocaleTimeString(),
                rxRate: Math.max(0, rxRate),
                txRate: Math.max(0, txRate),
              }];
              // Keep only last 20 points
              return newData.slice(-20);
            });

            prevRx.current = currentRx;
            prevTx.current = currentTx;
            prevTimestamp.current = currentTime;
          }
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching network data:', err);
        setError('Failed to fetch network data');
      }
    };

    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="cyber-card border-cyber-neon/50 border p-4">
        <h2 className="text-xl text-cyber-neon mb-4">Network Traffic</h2>
        <p className="text-cyber-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="cyber-card border-cyber-neon/50 border p-4">
      <h2 className="text-xl text-cyber-neon mb-4">Network Traffic</h2>
      {data.length === 0 ? (
        <p className="text-cyber-neon/70">Loading network data...</p>
      ) : (
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis dataKey="time" stroke="#30363d" />
          <YAxis stroke="#30363d" />
          <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #30363d' }} />
          <Legend />
          <Line type="monotone" dataKey="rxRate" stroke="#8884d8" name="RX (bytes/s)" dot={false} />
          <Line type="monotone" dataKey="txRate" stroke="#82ca9d" name="TX (bytes/s)" dot={false} />
        </LineChart>
      )}
    </div>
  );
};

export default NetworkTrafficChart;
