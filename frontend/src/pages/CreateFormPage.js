import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateFormPage.css";

export default function CreateFormPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowGuests, setAllowGuests] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app: send to backend
    alert(`Form "${title || 'Untitled'}" created!`);
    navigate("/");
  };

  return (
    <div className="create-form-container">
      <div className="create-form-card">
        <h2 className="create-form-title">Create New Form</h2>
        <p className="create-form-subtitle">Start collecting responses in seconds.</p>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label>Form Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer Feedback"
              required
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your form..."
              rows="3"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={allowGuests}
                onChange={(e) => setAllowGuests(e.target.checked)}
              />
              Allow unregistered users to respond
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}