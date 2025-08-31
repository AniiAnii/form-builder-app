// frontend/src/services/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

export default api;
