// src/routes/responseRoutes.js
const express = require("express");
const router = express.Router();
const responseController = require("../controllers/responseController");
const authMiddleware = require("../middleware/authMiddleware");

// Sve rute osim submit zahtevaju autentifikaciju
router.post("/submit/:formId", responseController.submitResponse); // anonimni mogu
router.use(authMiddleware); // ostale rute zahtevaju login

router.get("/form/:formId", responseController.getResponses);

module.exports = router;