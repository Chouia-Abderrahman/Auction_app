import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    // const navigate = useNavigate();
  try {
    console.log('Attempting login...');
    const response = await axios.post('/api/login/', { username, password });
    console.log('Login response:', response.data);
    const { token } = response.data;
    localStorage.setItem('token', token);
    console.log('Token stored in localStorage');
    await fetchUser(token);
    console.log('User fetched, attempting navigation...');
    // navigate('/dashboard');
    console.log('Navigation called');
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('/api/user/', {
        headers: { Authorization: `Token ${token}` }
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetching user failed:', error);
      logout();
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};