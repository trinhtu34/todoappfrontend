import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const AuthDebug = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        isAuthenticated,
        loading,
        user: user ? { ...user } : null,
        hasToken: !!authService.getToken(),
        tokenFromStorage: localStorage.getItem('accessToken'),
        refreshTokenFromStorage: localStorage.getItem('refreshToken'),
        timestamp: new Date().toLocaleTimeString()
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loading, user]);

  const testProfile = async () => {
    console.log('Testing profile API...');
    try {
      const result = await authService.getProfile();
      console.log('Profile result:', result);
      alert(`Profile API result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Profile error:', error);
      alert(`Profile API error: ${error.message}`);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md">
      <h3 className="font-bold text-sm mb-2">Auth Debug Info</h3>
      
      <div className="text-xs space-y-1">
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? '✅' : '❌'}
        </div>
        <div>
          <strong>Loading:</strong> {loading ? '⏳' : '✅'}
        </div>
        <div>
          <strong>Has Token:</strong> {debugInfo.hasToken ? '✅' : '❌'}
        </div>
        <div>
          <strong>User:</strong> {user ? user.name || user.username || 'Unknown' : 'None'}
        </div>
        <div>
          <strong>Token (first 20 chars):</strong> 
          <br />
          <code className="text-xs bg-gray-100 p-1 rounded">
            {debugInfo.tokenFromStorage ? debugInfo.tokenFromStorage.substring(0, 20) + '...' : 'None'}
          </code>
        </div>
        <div>
          <strong>Last Update:</strong> {debugInfo.timestamp}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={testProfile}
          className="w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
        >
          Test Profile API
        </button>
        <button
          onClick={clearStorage}
          className="w-full bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
        >
          Clear Storage & Reload
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;