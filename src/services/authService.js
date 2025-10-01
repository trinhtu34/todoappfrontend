import api from '../config/api';

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
    
    // Token sẽ được handle bởi api.js interceptor
  }

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        console.log('Login response:', response.data);
        
        this.token = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
      
        localStorage.setItem('accessToken', this.token);
        localStorage.setItem('refreshToken', this.refreshToken);
        localStorage.setItem('idToken', response.data.idToken);
        
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

  async register(email, password, name) {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại' 
      };
    }
  }

  async confirmSignUp(email, confirmationCode) {
    try {
      const response = await api.post('/auth/confirm', {
        email,
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
      const response = await api.post('/auth/refresh', {
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

const authServiceInstance = new AuthService();
export default authServiceInstance;