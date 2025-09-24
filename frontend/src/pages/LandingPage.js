// frontend/src/pages/LandingPage.js
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  // While checking auth or redirecting, show nothing
  if (user) return null;

  return (
    <div className="landing-page">
      {/* Left Side - Hero Content */}
      <div className="landing-content">
        <h1 className="landing-title">FormFlow</h1>
        <p className="landing-subtitle">
          Create beautiful, powerful forms with ease.
          <br />
          Trusted by teams for data collection, surveys, and feedback.
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>

      {/* Right Side - Decorative Illustration */}
      <div className="landing-visual">
        <div className="form-card">
          <h3>New Survey</h3>
          <p>Customer Feedback 2025</p>
          <div className="form-stats">
            <span>12 questions</span>
            <span>Open until Apr 30</span>
          </div>
        </div>
      </div>
    </div>
  );
}