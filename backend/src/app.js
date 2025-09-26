// backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

// Import all models to ensure they're registered with Sequelize
const User = require("./models/User");
const Form = require("./models/Form");
const Question = require("./models/Question");
const Response = require("./models/Response");
const Collaborator = require("./models/Collaborator");

// Import routes
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend radi!"));

// Sync all models and start server
const PORT = process.env.BACKEND_PORT || 5000;

async function startServer() {
  try {
    // Test database connection first
    await db.authenticate();
    console.log("MySQL konekcija uspostavljena.");

    // Sync all models
    await db.sync({ alter: true }); // Use alter: true to update existing tables
    console.log("Sve tabele sinhronizovane.");

    app.listen(PORT, () => {
      console.log(`Server radi na portu ${PORT}`);
    });
  } catch (error) {
    console.error("Greška prilikom pokretanja servera:", error);
    process.exit(1);
  }
}

startServer();