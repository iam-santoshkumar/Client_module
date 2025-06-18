import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read values directly from sessionStorage with default fallback
  const token = sessionStorage.getItem("token") || null;
  const expirationTime = sessionStorage.getItem("expirationTime") || null;
  const storedRole = sessionStorage.getItem("role") || null;

  const [authenticated, setAuthenticated] = useState(
    token && expirationTime && Date.now() < Number(expirationTime)
  );
  const [role, setRole] = useState(storedRole);

  useEffect(() => {
    // Double-check if token and expirationTime are valid once on mount
    if (token && expirationTime && Date.now() < Number(expirationTime)) {
      setAuthenticated(true);
      setRole(storedRole);
    } else if (
      token &&
      expirationTime &&
      Date.now() >= Number(expirationTime)
    ) {
      handleLogout(); // Clear session if expired
    }
  }, [token, expirationTime, storedRole]);

  const handleLogin = (userRole, token, expirationTime) => {
    console.log("Setting session storage:", {
      token,
      expirationTime,
      userRole,
    });

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("expirationTime", expirationTime);
    sessionStorage.setItem("role", userRole);

    setAuthenticated(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setRole(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, role, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
