import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch user's forms
  useEffect(() => {
    const loadForms = async () => {
      try {
        const res = await api.get("/forms/user");
        setForms(res.data.forms);
      } catch (err) {
        console.error("Failed to load forms:", err);
      }
    };
    if (user) loadForms();
  }, [user]);

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      setMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Change password failed");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      await api.delete("/auth/delete-account", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Your account has been deleted.");
      logout();
      navigate("/");
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>

      <div className="profile-card">
        <h2>{user?.name}</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Member since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Theme Toggle */}
      <div className="section">
        <h3>Appearance</h3>
        <label className="theme-toggle">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={theme === "light"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="toggle-input"
          />
          <div className="slider"></div>
        </label>
      </div>

      {/* Change Password */}
      <div className="section">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword} className="password-form">
          <input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
        {message && <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>{message}</p>}
      </div>

      {/* Created Forms */}
      <div className="section">
        <h3>Your Forms</h3>
        {forms.length === 0 ? (
          <p>You haven't created any forms yet.</p>
        ) : (
          <ul className="forms-list">
            {forms.map((form) => (
              <li key={form.id}>
                <strong>{form.title}</strong>
                <span>{form.responsesCount || 0} responses</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Account */}
      <div className="section danger-zone">
        <h3>Delete Account</h3>
        <p>This action is irreversible. All your data will be lost.</p>
        <button onClick={handleDeleteAccount} className="btn btn-danger">
          Delete My Account
        </button>
      </div>

      {/* Logout */}
      <button onClick={logout} className="btn btn-secondary">
        Logout
      </button>
    </div>
  );
}