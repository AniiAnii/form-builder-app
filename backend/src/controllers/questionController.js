const { Question, Form } = require("../models");

// Create a new question for a form
exports.createQuestion = async (req, res) => {
  try {
    const { formId, text, type, required, order, options, numericSettings, maxAnswers, answerLength, imageUrl } = req.body;

    // Verify user owns the form
    const form = await Form.findByPk(formId);
    if (!form || form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate required fields
    if (!text || !type) {
      return res.status(400).json({ message: "Text and type are required" });
    }

    const question = await Question.create({
      formId,
      text,
      type,
      required: required || false,
      order: order || 0,
      options: options || null,
      numericSettings: numericSettings || null,
      maxAnswers: maxAnswers || null,
      answerLength: answerLength || null,
      imageUrl: imageUrl || null
    });

    res.status(201).json({ message: "Question created successfully", question });
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all questions for a form
exports.getQuestionsByForm = async (req, res) => {
  try {
    const { formId } = req.params;

    // Verify user owns the form or is a collaborator
    const form = await Form.findByPk(formId);
    if (!form || form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const questions = await Question.findAll({
      where: { formId },
      order: [['order', 'ASC']]
    });

    res.json({ questions });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, type, required, order, options, numericSettings, maxAnswers, answerLength, imageUrl } = req.body;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Verify user owns the form
    const form = await Form.findByPk(question.formId);
    if (!form || form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await question.update({
      text,
      type,
      required,
      order,
      options,
      numericSettings,
      maxAnswers,
      answerLength,
      imageUrl
    });

    res.json({ message: "Question updated successfully", question });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Verify user owns the form
    const form = await Form.findByPk(question.formId);
    if (!form || form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await question.destroy();
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reorder questions
exports.reorderQuestions = async (req, res) => {
  try {
    const { formId, questions } = req.body; // questions: array of { id, order }

    // Verify user owns the form
    const form = await Form.findByPk(formId);
    if (!form || form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update each question's order
    for (const q of questions) {
      await Question.update({ order: q.order }, { where: { id: q.id, formId } });
    }

    res.json({ message: "Questions reordered successfully" });
  } catch (err) {
    console.error("Error reordering questions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Clone a question
exports.cloneQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const originalQuestion = await Question.findByPk(id);
    if (!originalQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Verify user owns the form
    const form = await Form.findByPk(originalQuestion.formId);
    if (!form || form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find the highest order number in this form
    const maxOrder = await Question.max('order', { where: { formId: originalQuestion.formId } });
    const newOrder = maxOrder ? maxOrder + 1 : 0;

    const clonedQuestion = await Question.create({
      formId: originalQuestion.formId,
      text: `${originalQuestion.text} (Copy)`,
      type: originalQuestion.type,
      required: originalQuestion.required,
      order: newOrder,
      options: originalQuestion.options,
      numericSettings: originalQuestion.numericSettings,
      maxAnswers: originalQuestion.maxAnswers,
      answerLength: originalQuestion.answerLength,
      imageUrl: originalQuestion.imageUrl
    });

    res.status(201).json({ message: "Question cloned successfully", question: clonedQuestion });
  } catch (err) {
    console.error("Error cloning question:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};