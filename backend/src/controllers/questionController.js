const { Question, Form, Collaborator } = require("../models");

// Pomoćna funkcija: proverava da li korisnik može uređivati formu
const canEditForm = async (formId, userId) => {
  const form = await Form.findByPk(formId);
  if (!form) return { can: false, error: "Form not found" };

  if (form.ownerId === userId) return { can: true };

  const collaborator = await Collaborator.findOne({
    where: { formId, userId, role: "editor" }
  });

  return collaborator ? { can: true } : { can: false, error: "No edit access" };
};

// --- CRUD OPERACIJE ---

// POST /api/questions
exports.createQuestion = async (req, res) => {
  try {
    const { formId, text, type, required, options, minChoices, step, rangeFrom, rangeTo, imageUrl } = req.body;

    const permission = await canEditForm(formId, req.user.id);
    if (!permission.can) return res.status(403).json({ message: permission.error });

    const maxOrder = await Question.max("order", { where: { formId } });
    const order = (maxOrder || 0) + 1;

    const question = await Question.create({
      formId,
      text,
      type,
      required: required || false,
      options,
      minChoices,
      step,
      rangeFrom,
      rangeTo,
      imageUrl,
      order
    });

    res.status(201).json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, type, required, options, minChoices, step, rangeFrom, rangeTo, imageUrl } = req.body;

    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const permission = await canEditForm(question.formId, req.user.id);
    if (!permission.can) return res.status(403).json({ message: permission.error });

    await question.update({
      text,
      type,
      required,
      options,
      minChoices,
      step,
      rangeFrom,
      rangeTo,
      imageUrl
    });

    res.json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const permission = await canEditForm(question.formId, req.user.id);
    if (!permission.can) return res.status(403).json({ message: permission.error });

    await question.destroy();
    res.json({ message: "Question deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/questions/form/:formId
exports.getQuestionsByForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findByPk(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    // Proveri pristup: vlasnik, editor, viewer
    const isOwner = form.ownerId === req.user.id;
    const isEditor = !!(await Collaborator.findOne({
      where: { formId, userId: req.user.id, role: "editor" }
    }));
    const isViewer = !!(await Collaborator.findOne({
      where: { formId, userId: req.user.id, role: "viewer" }
    }));

    if (!isOwner && !isEditor && !isViewer) {
      return res.status(403).json({ message: "Access denied" });
    }

    const questions = await Question.findAll({
      where: { formId },
      order: [["order", "ASC"]]
    });

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/questions/:id/clone
exports.cloneQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const original = await Question.findByPk(id);
    if (!original) return res.status(404).json({ message: "Question not found" });

    const permission = await canEditForm(original.formId, req.user.id);
    if (!permission.can) return res.status(403).json({ message: permission.error });

    const maxOrder = await Question.max("order", { where: { formId: original.formId } });
    const order = (maxOrder || 0) + 1;

    const cloned = await Question.create({
      ...original.toJSON(),
      id: undefined,
      order,
      createdAt: undefined,
      updatedAt: undefined
    });

    res.status(201).json({ question: cloned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/questions/reorder
exports.reorderQuestions = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }, ...]
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const questionIds = items.map(i => i.id);
    const questions = await Question.findAll({ where: { id: questionIds } });

    if (questions.length === 0) return res.status(400).json({ message: "No questions found" });

    const formId = questions[0].formId;
    const permission = await canEditForm(formId, req.user.id);
    if (!permission.can) return res.status(403).json({ message: permission.error });

    const updates = questions.map(q => {
      const newOrder = items.find(i => i.id === q.id)?.order;
      return q.update({ order: newOrder });
    });

    await Promise.all(updates);
    res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};