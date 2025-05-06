import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
  });

  // Set up effect to handle state when page loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setAuth({ token, role });
  }, []);

  // Login function
  const authLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData.role);
    setAuth({ token, role: userData.role });
  };

  // Logout function
//   const authLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     setAuth({ token: null, role: null });
//   };

  return (
    <AuthContext.Provider value={{ auth, authLogin, authLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
