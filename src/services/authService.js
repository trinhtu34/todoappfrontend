import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    
    // Debug logging
    console.log('AuthService initialized:', {
      hasToken: !!this.token,
      hasRefreshToken: !!this.refreshToken,
      tokenLength: this.token ? this.token.length : 0
    });
    
    // Configure axios defaults
    axios.defaults.withCredentials = false;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // Setup axios interceptor for automatic token attachment
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        // Ensure proper headers for CORS
        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Setup response interceptor for token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && this.refreshToken && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshAccessToken();
            // Update the authorization header with new token
            originalRequest.headers.Authorization = `Bearer ${this.token}`;
            // Retry the original request
            return axios.request(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            this.logout();
            // Don't redirect here, let the component handle it
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(usernameOrPhone, password) {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        usernameOrPhone,
        password
      });

      if (response.data.success) {
        console.log('Login response:', response.data);
        
        this.token = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        
        console.log('Setting tokens:', {
          accessToken: this.token ? this.token.substring(0, 20) + '...' : 'null',
          refreshToken: this.refreshToken ? this.refreshToken.substring(0, 20) + '...' : 'null'
        });
        
        localStorage.setItem('accessToken', this.token);
        localStorage.setItem('refreshToken', this.refreshToken);
        localStorage.setItem('idToken', response.data.idToken);
        
        // Verify storage
        console.log('Tokens stored:', {
          accessToken: localStorage.getItem('accessToken') ? 'stored' : 'not stored',
          refreshToken: localStorage.getItem('refreshToken') ? 'stored' : 'not stored',
          idToken: localStorage.getItem('idToken') ? 'stored' : 'not stored'
        });
        
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  }

  async register(phoneNumber, password, name, username) {
    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        phoneNumber,
        password,
        name,
        username
      });

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại' 
      };
    }
  }

  async confirmSignUp(username, confirmationCode) {
    try {
      const response = await axios.post(API_ENDPOINTS.CONFIRM, {
        username,
        confirmationCode
      });

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xác nhận thất bại' 
      };
    }
  }

  async refreshAccessToken() {
    try {
      const response = await axios.post(API_ENDPOINTS.REFRESH, {
        refreshToken: this.refreshToken
      });

      this.token = response.data.accessToken;
      localStorage.setItem('accessToken', this.token);
      localStorage.setItem('idToken', response.data.idToken);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Profile method removed - using JWT token decode instead
  getUserFromToken() {
    if (!this.token) return null;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return {
        username: payload.username || payload['cognito:username'],
        sub: payload.sub,
        name: payload.name || payload['cognito:username'],
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('idToken');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

export default new AuthService();