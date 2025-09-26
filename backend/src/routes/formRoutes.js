const express = require("express");
const router = express.Router();
const { createForm, getMyForms, getFormById } = require("../controllers/formController");
const authMiddleware = require("../middleware/authMiddleware");

// All form routes require authentication
router.use(authMiddleware);

// Create new form
router.post("/", createForm);

// Get user's forms
router.get("/user", getMyForms);

// Get specific form by ID
router.get("/:id", getFormById);

module.exports = router;