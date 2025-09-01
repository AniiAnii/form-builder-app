const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const waitForDb = require('./utils/waitForDb'); 

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

(async () => { 
  try { 
    await waitForDb(); 
    await db.sync(); // koristi db.sync()
    app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`)); 
  } catch (err) { 
    console.error("Konekcija ka bazi neuspešna:", err); 
  } 
})();
