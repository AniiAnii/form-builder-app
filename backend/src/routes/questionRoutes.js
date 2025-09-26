const express = require("express");
const router = express.Router();
const { 
  createQuestion, 
  getQuestionsByForm, 
  updateQuestion, 
  deleteQuestion, 
  reorderQuestions,
  cloneQuestion
} = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// All question routes require authentication
router.use(authMiddleware);

// Create a new question for a form
router.post("/", createQuestion);

// Get all questions for a form
router.get("/form/:formId", getQuestionsByForm);

// Update a question
router.put("/:id", updateQuestion);

// Delete a question
router.delete("/:id", deleteQuestion);

// Reorder questions
router.put("/reorder", reorderQuestions);

// Clone a question
router.post("/:id/clone", cloneQuestion);

module.exports = router;