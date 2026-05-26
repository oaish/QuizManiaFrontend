import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Sync session state on boot
    const storedUser = localStorage.getItem('quizmania_user');
    const token = localStorage.getItem('quizmania_jwt_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      
      // Verification check from API server
      api.get('/auth/profile')
        .then((res) => {
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('quizmania_user', JSON.stringify(res.user));
          }
        })
        .catch((err) => {
          console.error('Session validation failed. Logging out.', err.message);
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('quizmania_jwt_token', res.token);
        localStorage.setItem('quizmania_user', JSON.stringify(res.user));
        setUser(res.user);
      }
      return res;
    } catch (error) {
      console.error('Login action error:', error.message);
      throw error;
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.success) {
        localStorage.setItem('quizmania_jwt_token', res.token);
        localStorage.setItem('quizmania_user', JSON.stringify(res.user));
        setUser(res.user);
      }
      return res;
    } catch (error) {
      console.error('Registration action error:', error.message);
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('quizmania_jwt_token');
    localStorage.removeItem('quizmania_user');
    setUser(null);
  };

  // Update locally cached user state (e.g. on profile edits)
  const updateUserLocalState = (updatedUser) => {
    localStorage.setItem('quizmania_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserLocalState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
