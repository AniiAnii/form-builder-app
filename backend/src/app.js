const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const waitForDb = require('./utils/waitForDb'); 
const formRoutes = require("./routes/formRoutes"); 
const questionRoutes = require("./routes/questionRoutes");
const questionImageRoutes = require('./routes/questionImageRoutes');
const responseRoutes = require("./routes/responseRoutes");

// Učitaj modele
const User = require("./models/User");
const Form = require("./models/Form");

const Question = require("./models/Question");
const Response = require("./models/Response");
const Collaborator = require("./models/Collaborator");

require("./models/associations")(); // Učitaj sve relacije

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta za autentifikaciju
app.use("/api/auth", authRoutes);

app.use("/api/forms", formRoutes); 

app.use("/api/questions", questionRoutes);
app.use("/api/questions", questionImageRoutes);

app.use("/api/responses", responseRoutes);

// Serviraj statičke fajlove (slike)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Test ruta
app.get("/", (req, res) => res.send("Backend radi!"));

// === Bolja inicijalizacija sa povezivanjem i sinhronizacijom ===
const PORT = process.env.BACKEND_PORT || 5000;

(async () => { 
  try { 
    await waitForDb(); 
    await db.authenticate();
    console.log("uspostavljena konekcija sa bazom");
    try {
      await User.sync();
      console.log("Tabela 'users' sinhronizovana.");

      await Form.sync();
      console.log("Tabela 'forms' sinhronizovana.");

      await Question.sync();
      console.log("Tabela 'questions' sinhronizovana.");

      await Response.sync();
      console.log("Tabela 'responses' sinhronizovana.");

      await Collaborator.sync();
      console.log("Tabela 'collaborators' sinhronizovana.");

      console.log("Sve tabele su uspešno sinhronizovane.");
    } catch (syncErr) {
      console.error("Greška prilikom sinhronizacije tabela:", syncErr);
      process.exit(1);
    }

    app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`)); 
  } catch (err) { 
    console.error("Konekcija ka bazi neuspešna:", err); 
  } 
})();
