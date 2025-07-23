import { createContext, useContext, useState, useEffect } from 'react';
import { connectSocket } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    connectSocket(jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (token) connectSocket(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);