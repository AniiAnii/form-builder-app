// frontend/src/App.js
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateFormPage from "./pages/CreateFormPage";
import ProfilePage from "./pages/ProfilePage";

// Define all routes using configuration object
const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forms/create", element: <CreateFormPage /> },
  { path: "/profile", element: <ProfilePage /> },
  // Fallback route
  { path: "*", element: <Navigate to="/" replace /> }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;