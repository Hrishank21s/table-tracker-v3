import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              Table Tracker
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/snooker"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/snooker' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`}
              >
                Snooker Tables
              </Link>
              <Link
                to="/pool"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/pool' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`}
              >
                Pool Tables
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/admin' ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                  }`}
                >
                  Admin Settings
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Welcome, {user?.username} ({user?.role})
            </span>
            <button
              onClick={onLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
