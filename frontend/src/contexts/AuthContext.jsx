/**
 * ProjectHub AI - Auth Context
 * Global authentication state management
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('projecthub_token');
    const savedUser = localStorage.getItem('projecthub_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        api.get('/auth/me').then(res => {
          setUser(res.data.user);
          localStorage.setItem('projecthub_user', JSON.stringify(res.data.user));
        }).catch(() => {
          logout();
        });
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('projecthub_token', token);
    localStorage.setItem('projecthub_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('projecthub_token');
    localStorage.removeItem('projecthub_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('projecthub_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user, loading, isAdmin, isStudent, isAuthenticated,
      login, logout, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
