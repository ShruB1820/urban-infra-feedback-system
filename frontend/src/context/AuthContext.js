import React, { createContext, useState, useContext } from 'react';
import { setAuthToken } from '../api/issueApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const parsed = JSON.parse(stored);
    setAuthToken(parsed.token); // set token on Axios
    return parsed;
  }
  return null;
});

const login = (userData) => {
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
  setAuthToken(userData.token);
};
const logout = () => {
  setUser(null);
  localStorage.removeItem('user');
  setAuthToken(null);
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
