import React from 'react';
import { useLocation } from 'react-router-dom';

const DevNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
    { path: '/simple-login', label: 'Simple Login' },
    { path: '/debug-login', label: 'Debug Login' },
    { path: '/auth-status', label: 'Auth Status' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <div className="bg-gray-800 text-white p-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2">
          <span className="text-gray-300 mr-4">Dev Navigation:</span>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`px-3 py-1 rounded text-sm ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevNavigation;