// backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Učitaj modele da se registruju u Sequelize
const User = require("./models/User");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta za autentifikaciju
app.use("/api/auth", authRoutes);

// Test ruta
app.get("/", (req, res) => res.send("Backend radi!"));

// Sinhronizacija modela sa bazom i pokretanje servera
const PORT = process.env.BACKEND_PORT || 5000;
db.sync() // koristi db.sync({ force: true }) ako želiš da resetuješ tabele tokom razvoja
  .then(() => {
    console.log("DB synced");
    app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
  })
  .catch(err => console.error("DB sync error:", err));
