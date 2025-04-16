// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (credentials.username && credentials.password) {
      try {
        const response = await fetch('/api/auth/login', {  // Using proxy path instead of full URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email: credentials.username, password: credentials.password })
        });
  
        const data = await response.json();
        console.log('data', data);
  
        if (response.ok && data.success) {
          console.log("login success");
  
          // Store JWT token in localStorage after login
          localStorage.setItem('token', data.token);  // Save the JWT token in localStorage
          
          // Store other necessary information (e.g., user data, lastLogin)
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('lastLogin', data.user.lastLogin);
  
          // Redirect to dashboard after successful login
          navigate('/dashboard', { replace: true });
        } else {
          // Display error message from backend or fallback message
          setError(data.message || 'Login failed');
        }
      } catch (err) {
        console.error('Error during login:', err);
        setError('Login failed: ' + err.message);
      }
    } else {
      setError('ACCESS DENIED: INVALID CREDENTIALS');
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
      
      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="cyber-card max-w-md w-full backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-cyber-neon glitch-text mb-2">
              SPOOFBUSTERS
            </h1>
            <div className="text-cyber-neon/50 text-sm code-text cursor-effect">
              SECURE ACCESS TERMINAL v1.0
            </div>
          </div>
          
          {error && (
            <div className="cyber-badge-danger mb-4 text-center py-2 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-cyber-neon text-sm tracking-wider" htmlFor="username">
                [SYSTEM]: ENTER_USERNAME
              </label>
              <input
                id="username"
                type="text"
                className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                           focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none
                           placeholder-cyber-neon/30"
                placeholder="root@spoofbusters"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-cyber-neon text-sm tracking-wider" htmlFor="password">
                [SYSTEM]: ENTER_PASSWORD
              </label>
              <input
                id="password"
                type="password"
                className="cyber-input w-full bg-cyber-darker border border-cyber-neon/50 text-cyber-neon p-2 rounded-sm
                           focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon outline-none
                           placeholder-cyber-neon/30"
                placeholder="****************"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
              />
            </div>

            <button
              type="submit"
              className="cyber-button w-full group"
            >
              <span className="group-hover:animate-pulse">INITIALIZE LOGIN SEQUENCE</span>
            </button>
          </form>

          <div className="mt-6 text-center text-cyber-neon/30 text-xs">
            <p className="cursor-effect">SYSTEM STATUS: ACTIVE</p>
            <p className="mt-1">ENCRYPTION: ENABLED | SECURITY PROTOCOL: ACTIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
