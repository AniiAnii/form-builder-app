const { Response, Form, Question } = require("../models");

// Submit a form response
exports.submitResponse = async (req, res) => {
  try {
    const { formId, submittedBy, email, answers } = req.body;

    // Verify form exists and is not locked
    const form = await Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.isLocked) {
      return res.status(400).json({ message: "Form is closed" });
    }

    // If form doesn't allow guests, require authentication
    if (!form.allowGuests) {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
    }

    // Validate answers against questions
    const questions = await Question.findAll({
      where: { formId },
      attributes: ['id', 'type', 'required']
    });

    const questionMap = {};
    questions.forEach(q => {
      questionMap[q.id] = q;
    });

    // Validate each answer
    for (const ans of answers) {
      const q = questionMap[ans.questionId];
      if (!q) {
        return res.status(400).json({ message: `Invalid question: ${ans.questionId}` });
      }

      // Validate required questions
      if (q.required && (!ans.answer || (Array.isArray(ans.answer) && ans.answer.length === 0))) {
        return res.status(400).json({ message: `Question "${q.text}" is required` });
      }
    }

    // Create response
    const response = await Response.create({
      formId,
      submittedBy,  // This can be null for guest responses
      email,
      answers
    });

    res.status(201).json({ message: "Response submitted successfully", response });
  } catch (err) {
    console.error("Error submitting response:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get responses for a form (owner only)
exports.getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    // Verify user owns the form
    const form = await Form.findByPk(formId);
    if (!form || form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const responses = await Response.findAll({
      where: { formId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ responses });
  } catch (err) {
    console.error("Error fetching responses:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};