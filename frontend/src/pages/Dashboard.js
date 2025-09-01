import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [forms, setForms] = useState([
    { id: 1, title: "Customer Feedback 2025", responses: 12, createdAt: "Apr 5, 2025" },
    { id: 2, title: "Event Registration", responses: 8, createdAt: "Mar 28, 2025" },
  ]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">My Forms</h1>
        <Link to="/forms/create" className="btn btn-primary">
          ➕ New Form
        </Link>
      </header>

      {forms.length === 0 ? (
        <div className="empty-state">
          <h3>No forms yet</h3>
          <p>Create your first form to get started.</p>
          <Link to="/forms/create" className="btn btn-primary">Create Form</Link>
        </div>
      ) : (
        <div className="forms-grid">
          {forms.map((form) => (
            <Link to={`/form/${form.id}/edit`} key={form.id} className="form-card-link">
              <div className="form-card">
                <h3 className="form-title">{form.title}</h3>
                <div className="form-meta">
                  <span>{form.responses} responses</span>
                  <span>Created {form.createdAt}</span>
                </div>
                <div className="form-actions">
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button className="btn btn-sm btn-outline">Responses</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}