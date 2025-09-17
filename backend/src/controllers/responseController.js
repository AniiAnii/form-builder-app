const { Form, Response, Question } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");

// Provera pristupa formi (za prikaz i slanje)
const canAccessForm = async (formId, req) => {
  const form = await Form.findByPk(formId);
  if (!form) return { can: false, error: "Form not found" };

  // Ako je forma zaključana
  if (form.isLocked) return { can: false, error: "Form is closed" };

  // Ako dozvoljava anonimne, bilo ko može da popunjava
  if (form.allowGuests) return { can: true, form };

  // Inače, mora biti prijavljen
  if (!req.user) return { can: false, error: "Authentication required" };

  return { can: true, form };
};

// POST /api/responses/submit/:formId
exports.submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body; // [{ questionId, answer, ... }, ...]

    // Proveri da li korisnik može da pristupi formi
    const access = await canAccessForm(formId, req);
    if (!access.can) return res.status(403).json({ message: access.error });

    const form = access.form;

    // Validacija: proveri da li sva pitanja postoje i da li su obavezna
    const questions = await Question.findAll({
      where: { formId },
      attributes: ['id', 'type', 'required']
    });

    const questionMap = {};
    questions.forEach(q => {
      questionMap[q.id] = q;
    });

    for (const ans of answers) {
      const q = questionMap[ans.questionId];
      if (!q) return res.status(400).json({ message: `Question ${ans.questionId} not found` });

      if (q.required && (!ans.answer || (Array.isArray(ans.answer) && ans.answer.length === 0))) {
        return res.status(400).json({ message: `Answer for question ${ans.questionId} is required` });
      }
    }

    // Spreman za čuvanje
    const response = await Response.create({
      formId,
      submittedBy: req.user?.id || null, // null ako je anonimni
      answers: answers // JSON polje
    });

    res.status(201).json({ message: "Response submitted", responseId: response.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/responses/form/:formId → samo za vlasnike i kolabore
exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findByPk(formId);

    if (!form) return res.status(404).json({ message: "Form not found" });

    // Proveri pristup: vlasnik, editor, viewer
    const isOwner = form.ownerId === req.user.id;
    const isCollaborator = !!(await Collaborator.findOne({
      where: { formId, userId: req.user.id }
    }));

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    const responses = await Response.findAll({
      where: { formId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ responses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};