import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);

        // Decode JWT token để lấy thông tin user cơ bản
        const token = authService.getToken();
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const groups = payload['cognito:groups'] || [];
            const userType = groups.includes('Premium-user') ? 'premium' : 'free';
            
            setUser({
              username: payload.username || payload['cognito:username'] || 'User',
              sub: payload.sub,
              name: payload.name || payload['cognito:username'] || 'User',
              userType: userType
            });
          } catch (decodeError) {
            console.warn('Could not decode token, using default user info');
            setUser({ username: 'User', name: 'User' });
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);

      // Decode token để lấy thông tin user
      const token = authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const groups = payload['cognito:groups'] || [];
          const userType = groups.includes('Premium-user') ? 'premium' : 'free';
          
          setUser({
            username: payload.username || payload['cognito:username'] || email,
            sub: payload.sub,
            name: payload.name || payload['cognito:username'] || email,
            userType: userType
          });
        } catch (decodeError) {
          console.warn('Could not decode token after login');
          setUser({ username: email, name: email });
        }
      }
    }
    return result;
  };

  const register = async (email, password, name) => {
    return await authService.register(email, password, name);
  };

  const confirmSignUp = async (email, confirmationCode) => {
    return await authService.confirmSignUp(email, confirmationCode);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    confirmSignUp,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};