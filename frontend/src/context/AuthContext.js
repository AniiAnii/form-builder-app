// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { me } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await me(token);
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch (err) {
        console.error("Token invalid, logging out", err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  function loginSuccess({ token: t, user: u }) {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
