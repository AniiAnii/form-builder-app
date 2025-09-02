const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// Sve rute zahtevaju autentifikaciju
router.use(authMiddleware);

router.post("/", questionController.createQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);
router.get("/form/:formId", questionController.getQuestionsByForm);
router.post("/:id/clone", questionController.cloneQuestion);
router.put("/reorder", questionController.reorderQuestions);

module.exports = router;