import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';

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
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/profile/');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { user, tokens } = response.data;
      
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
      
      setUser(user);
      setToken(tokens.access);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      const { user, tokens } = response.data;
      
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
      
      setUser(user);
      setToken(tokens.access);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.post('/auth/google/', { 
          token: tokenResponse.access_token 
        });
        const { user, tokens } = response.data;
        
        localStorage.setItem('token', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
        
        setUser(user);
        setToken(tokens.access);
      } catch (error) {
        console.error('Google login failed:', error);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
    }
  });

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    googleLogin,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
