import React, { createContext, useState, useEffect } from "react";
import { me } from "../services/authService";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    async function loadUser() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await me(token);
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
        
        // Load forms after user is loaded
        await loadForms();
      } catch (err) {
        console.error("Token invalid, logging out", err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  // Function to load forms
  const loadForms = async () => {
    if (!user) return;
    try {
      const res = await api.get("/forms/user");
      setForms(res.data.forms);
    } catch (err) {
      console.error("Failed to load forms:", err);
    }
  };

  // Function to refresh forms list
  const refreshForms = async () => {
    if (!user) return;
    try {
      const res = await api.get("/forms/user");
      setForms(res.data.forms);
    } catch (err) {
      console.error("Failed to reload forms:", err);
    }
  };

  function loginSuccess({ token: t, user: u }) {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  }

  function logout() {
    setToken(null);
    setUser(null);
    setForms([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      loading, 
      loginSuccess, 
      logout, 
      forms, 
      refreshForms 
    }}>
      {children}
    </AuthContext.Provider>
  );
};