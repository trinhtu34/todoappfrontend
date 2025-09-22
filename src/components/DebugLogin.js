import React, { useState } from 'react';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const DebugLogin = () => {
  const [credentials, setCredentials] = useState({
    usernameOrPhone: '',
    password: ''
  });
  const [logs, setLogs] = useState([]);
  const { isAuthenticated, user, checkAuthStatus } = useAuth();

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  const testLogin = async () => {
    clearLogs();
    addLog('Starting login test...');
    
    try {
      addLog(`Attempting login with: ${credentials.usernameOrPhone}`);
      
      const result = await authService.login(credentials.usernameOrPhone, credentials.password);
      
      addLog(`Login result: ${JSON.stringify(result, null, 2)}`);
      
      if (result.success) {
        addLog('Login successful! Checking storage...');
        
        // Check localStorage
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const idToken = localStorage.getItem('idToken');
        
        addLog(`Storage check:
- Access Token: ${accessToken ? 'Present (' + accessToken.length + ' chars)' : 'Missing'}
- Refresh Token: ${refreshToken ? 'Present (' + refreshToken.length + ' chars)' : 'Missing'}
- ID Token: ${idToken ? 'Present (' + idToken.length + ' chars)' : 'Missing'}`);
        
        // Check authService state
        addLog(`AuthService state:
- isAuthenticated(): ${authService.isAuthenticated()}
- getToken(): ${authService.getToken() ? 'Present' : 'Missing'}`);
        
        // Trigger auth context check
        addLog('Triggering AuthContext checkAuthStatus...');
        await checkAuthStatus();
        
      } else {
        addLog(`Login failed: ${result.message}`);
      }
      
    } catch (error) {
      addLog(`Login error: ${error.message}`);
    }
  };

  const checkCurrentState = () => {
    addLog('=== Current State Check ===');
    addLog(`AuthContext - isAuthenticated: ${isAuthenticated}`);
    addLog(`AuthContext - user: ${JSON.stringify(user)}`);
    addLog(`AuthService - isAuthenticated(): ${authService.isAuthenticated()}`);
    addLog(`AuthService - getToken(): ${authService.getToken() ? 'Present' : 'Missing'}`);
    
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const idToken = localStorage.getItem('idToken');
    
    addLog(`LocalStorage:
- Access Token: ${accessToken ? 'Present' : 'Missing'}
- Refresh Token: ${refreshToken ? 'Present' : 'Missing'}
- ID Token: ${idToken ? 'Present' : 'Missing'}`);
  };

  const clearStorage = () => {
    localStorage.clear();
    addLog('LocalStorage cleared');
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Debug Login</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Login Form */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Login Test</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username or Phone"
              value={credentials.usernameOrPhone}
              onChange={(e) => setCredentials({...credentials, usernameOrPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <div className="flex space-x-2">
              <button
                onClick={testLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Test Login
              </button>
              <button
                onClick={checkCurrentState}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Check State
              </button>
              <button
                onClick={clearStorage}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Storage
              </button>
            </div>
          </div>
          
          {/* Current Status */}
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h4 className="font-semibold">Current Status:</h4>
            <p>AuthContext Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
            <p>User: {user ? JSON.stringify(user) : 'None'}</p>
            <p>AuthService Token: {authService.getToken() ? '✅' : '❌'}</p>
          </div>
        </div>
        
        {/* Logs */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Debug Logs</h3>
            <button
              onClick={clearLogs}
              className="text-sm bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-black text-green-400 p-3 rounded h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugLogin;