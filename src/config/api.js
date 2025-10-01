import axios from 'axios';

const API_BASE_URL = 'https://localhost:62715/api';

// Disable SSL verification for localhost development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token when 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          console.log('Token hết hạn, đang refresh...');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const newToken = response.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          localStorage.setItem('idToken', response.data.idToken);
          
          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('Refresh thành công, retry request');
          return api.request(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token thất bại:', refreshError);
          // Clear tokens và redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('idToken');
          window.location.href = '/login';
        }
      } else {
        // Không có refresh token, redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;