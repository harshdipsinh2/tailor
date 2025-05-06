import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null }); // ✅ rename to auth

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("user")); // ✅ consistent key
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ consistent
  };

  const logout = () => {
    setAuth({ token: null, role: null });
    localStorage.removeItem("user"); // ✅ fix key
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
