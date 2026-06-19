/**
 * Authentication Context
 * Manages authentication state across the app
 */

import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  // Register function
  const register = async (data) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', data);
      const { user: userData, token: userToken } = response.data.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, data: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, data: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
