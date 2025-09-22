import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const AuthStatus = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const token = authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setTokenInfo({
            username: payload.username || payload['cognito:username'],
            sub: payload.sub,
            exp: new Date(payload.exp * 1000).toLocaleString(),
            iat: new Date(payload.iat * 1000).toLocaleString(),
            token_use: payload.token_use,
            client_id: payload.client_id
          });
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Authentication Status</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
          </span>
        </div>

        {user && (
          <div>
            <h3 className="font-semibold mb-2">User Info:</h3>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              {user.sub && <p><strong>Sub:</strong> {user.sub}</p>}
            </div>
          </div>
        )}

        {tokenInfo && (
          <div>
            <h3 className="font-semibold mb-2">Token Info:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p><strong>Username:</strong> {tokenInfo.username}</p>
              <p><strong>Subject:</strong> {tokenInfo.sub}</p>
              <p><strong>Client ID:</strong> {tokenInfo.client_id}</p>
              <p><strong>Token Use:</strong> {tokenInfo.token_use}</p>
              <p><strong>Issued At:</strong> {tokenInfo.iat}</p>
              <p><strong>Expires At:</strong> {tokenInfo.exp}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Storage Info:</h3>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p><strong>Access Token:</strong> {localStorage.getItem('accessToken') ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>Refresh Token:</strong> {localStorage.getItem('refreshToken') ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>ID Token:</strong> {localStorage.getItem('idToken') ? '✅ Present' : '❌ Missing'}</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="pt-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                authService.logout();
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="pt-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.href = '/simple-login'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Simple Login Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStatus;