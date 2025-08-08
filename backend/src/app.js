const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Test ruta
app.get("/", (req, res) => {
    res.send("Backend radi!");
});

// Pokretanje servera
const PORT = process.env.BACKEND_PORT || 5000;
db.authenticate()
    .then(() => {
        console.log("MySQL konekcija uspostavljena.");
        app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
    })
    .catch(err => console.log("Greška pri konekciji na bazu:", err));
