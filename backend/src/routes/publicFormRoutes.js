const express = require("express");
const router = express.Router();
const { Form, Question } = require("../models");

// GET /api/form/share/:shareToken → prikaži formu za goste
router.get("/form/share/:shareToken", async (req, res) => {
  try {
    const { shareToken } = req.params;

    const form = await Form.findOne({
      where: { shareToken },
      attributes: ['id', 'title', 'description', 'allowGuests', 'isLocked']
    });

    if (!form) return res.status(404).json({ message: "Form not found" });
    if (!form.allowGuests) return res.status(403).json({ message: "Guest access disabled" });
    if (form.isLocked) return res.status(403).json({ message: "Form is closed" });

    const questions = await Question.findAll({
      where: { formId: form.id },
      order: [['order', 'ASC']]
    });

    res.json({ form, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;