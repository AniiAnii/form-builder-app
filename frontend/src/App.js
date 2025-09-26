import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import CreateFormPage from "./pages/CreateFormPage";
import ProfilePage from "./pages/ProfilePage";
import FormBuilderPage from "./pages/FormBuilderPage"; 
import FormFillPage from "./pages/FormFillPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/create" element={<CreateFormPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forms/:formId/fill" element={<FormFillPage />} />
        <Route path="/forms/:formId/edit" element={<FormBuilderPage />} /> {/* this route  */}
      </Routes>
    </Router>
  );
}

export default App;