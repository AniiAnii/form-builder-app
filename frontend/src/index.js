import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <AuthProvider>
      <App />
    </AuthProvider>
  
);

// Pokreni merenje performansi i loguj rezultate u konzolu
reportWebVitals(console.log);
