const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Single import: get all needed functions at once
const { 
  register, 
  login, 
  me, 
  changePassword, 
  deleteAccount 
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

// Protected routes
router.post("/change-password", authMiddleware, changePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;