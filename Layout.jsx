// src/components/Layout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-cyber-dark">
      {/* Sidebar */}
      <div className="w-64 bg-cyber-darker border-r border-cyber-neon/30">
        <div className="p-4">
          <Link to="/dashboard" className="text-cyber-neon text-2xl font-bold">
            SPOOFBUSTERS
          </Link>
        </div>
        <nav className="mt-8">
          <Link
            to="/dashboard"
            className="flex items-center px-6 py-3 text-cyber-neon hover:bg-cyber-neon/10"
          >
            <span className="mx-4">Dashboard</span>
          </Link>
          <Link
            to="/scanner"
            className="flex items-center px-6 py-3 text-cyber-neon hover:bg-cyber-neon/10"
          >
            <span className="mx-4">URL Scanner</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full cyber-button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-cyber-dark">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
