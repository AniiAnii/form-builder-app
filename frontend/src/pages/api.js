// frontend/src/pages/api.js

const API_BASE = 'http://localhost:5000/api';

const api = {
  createForm: async (data, token) => {
    const res = await fetch(`${API_BASE}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  getMyForms: async (token) => {
    const res = await fetch(`${API_BASE}/forms`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  },

  submitResponse: async (formId, data) => {
    const res = await fetch(`${API_BASE}/responses/submit/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
};

export default api;