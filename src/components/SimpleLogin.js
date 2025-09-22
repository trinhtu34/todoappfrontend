import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const SimpleLogin = () => {
  const [formData, setFormData] = useState({
    usernameOrPhone: '',
    password: ''
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Testing login...');

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        usernameOrPhone: formData.usernameOrPhone,
        password: formData.password
      });

      if (response.data.success) {
        setResult(`✅ Login successful!\nAccess Token: ${response.data.accessToken.substring(0, 50)}...\nRefresh Token: ${response.data.refreshToken.substring(0, 50)}...`);
        
        // Store tokens
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('idToken', response.data.idToken);
      } else {
        setResult(`❌ Login failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        setResult(`❌ Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        setResult(`❌ Network error: No response from server`);
      } else {
        setResult(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testTodos = async () => {
    setLoading(true);
    setResult('Testing todos API...');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setResult('❌ No access token found. Please login first.');
        return;
      }

      const response = await axios.get(API_ENDPOINTS.TODOS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setResult(`✅ Todos API working!\nResponse: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      if (error.response) {
        setResult(`❌ Todos API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        setResult(`❌ Network error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Simple Login Test</h2>
      
      <form onSubmit={testLogin} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username or Phone:
          </label>
          <input
            type="text"
            name="usernameOrPhone"
            value={formData.usernameOrPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username or phone"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            required
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Test Login
          </button>
          
          <button
            type="button"
            onClick={testTodos}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Test Todos API
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>API URL:</strong> {API_ENDPOINTS.LOGIN.replace('/auth/login', '')}</p>
        <p><strong>Login Endpoint:</strong> {API_ENDPOINTS.LOGIN}</p>
        <p><strong>Todos Endpoint:</strong> {API_ENDPOINTS.TODOS}</p>
      </div>
    </div>
  );
};

export default SimpleLogin;