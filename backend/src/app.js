const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const waitForDb = require('./utils/waitForDb'); 
const formRoutes = require("./routes/formRoutes"); 
const questionRoutes = require("./routes/questionRoutes");

// Učitaj modele
const User = require("./models/User");
const Form = require("./models/Form");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta za autentifikaciju
app.use("/api/auth", authRoutes);

app.use("/api/forms", formRoutes); 

app.use("/api/questions", questionRoutes);

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
