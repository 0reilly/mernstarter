import React, { createContext, useState, useEffect } from 'react';
import { decodeToken } from '../utils/decodeToken';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [username, setUsername] = useState(() => (token ? decodeToken(token)?.username : null));

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.username) {
        setUsername(decoded.username);
      } else {
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};