const express = require("express");
const router = express.Router();
const { submitResponse, getFormResponses } = require("../controllers/responseController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit a response (public endpoint - no auth required)
router.post("/", submitResponse);

// Get responses for a form (owner only)
router.get("/form/:formId", authMiddleware, getFormResponses);

module.exports = router;