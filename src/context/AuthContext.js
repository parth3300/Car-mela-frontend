import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem("username") || null);
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);

  const login = (accessToken, username) => {
    setToken(accessToken);
    setUser(username);

    // ✅ Store token and username in localStorage
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    // ✅ Delete from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  };

  useEffect(() => {
    // Optionally fetch user on load if token exists
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("username");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);
