const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Učitaj modele
const User = require("./models/User");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta za autentifikaciju
app.use("/api/auth", authRoutes);

// Test ruta
app.get("/", (req, res) => res.send("Backend radi!"));

// === Bolja inicijalizacija sa povezivanjem i sinhronizacijom ===
const PORT = process.env.BACKEND_PORT || 5000;

async function startServer() {
  try {
    // 1. Proveri konekciju ka bazi
    await db.authenticate();
    console.log("MySQL konekcija uspostavljena.");

    // 2. Sinhronizuj modele
    await db.sync(/* { force: false } */);
    console.log("Baza sinhronizovana.");

    // 3. Pokreni server
    app.listen(PORT, () => {
      console.log(`Server radi na portu ${PORT}`);
    });
  } catch (error) {
    console.error("Greška prilikom pokretanja servera:", error);
    process.exit(1); // Zaustavi aplikaciju ako DB nije dostupna
  }
}

startServer();