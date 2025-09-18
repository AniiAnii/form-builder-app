const XLSX = require('xlsx');
const { Form, Response, Question, Collaborator } = require('../models');

// Provera pristupa formi (za prikaz i slanje)
const canAccessForm = async (formId, req) => {
  const form = await Form.findByPk(formId);
  if (!form) return { can: false, error: 'Form not found' };

  // Ako je forma zaključana
  if (form.isLocked) return { can: false, error: 'Form is closed' };

  // Ako dozvoljava anonimne, bilo ko može da popunjava
  if (form.allowGuests) return { can: true, form };

  // Inače, mora biti prijavljen
  if (!req.user) return { can: false, error: 'Authentication required' };

  return { can: true, form };
};

// POST /api/responses/submit/:formId
exports.submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body; // [{ questionId, answer }, ...]

    // Proveri pristup formi
    const access = await canAccessForm(formId, req);
    if (!access.can) return res.status(403).json({ message: access.error });

    const form = access.form;

    // Dohvati pitanja za validaciju
    const questions = await Question.findAll({
      where: { formId },
      attributes: ['id', 'type', 'required']
    });

    const questionMap = {};
    questions.forEach(q => {
      questionMap[q.id] = q;
    });

    // Validacija odgovora
    for (const ans of answers) {
      const q = questionMap[ans.questionId];
      if (!q) {
        return res.status(400).json({ message: `Question ${ans.questionId} not found` });
      }

      if (q.required && (!ans.answer || (Array.isArray(ans.answer) && ans.answer.length === 0))) {
        return res.status(400).json({ message: `Answer for question ${ans.questionId} is required` });
      }
    }

    // Sačuvaj odgovor
    const response = await Response.create({
      formId,
      submittedBy: req.user?.id || null, // null za anonimne korisnike
      answers // JSON polje
    });

    res.status(201).json({ message: 'Response submitted', responseId: response.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/responses/form/:formId → samo vlasnik i kolaboratori
exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findByPk(formId);

    if (!form) return res.status(404).json({ message: 'Form not found' });

    const isOwner = form.ownerId === req.user.id;
    const isEditorOrViewer = !!(await Collaborator.findOne({
      where: { formId, userId: req.user.id }
    }));

    if (!isOwner && !isEditorOrViewer) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const responses = await Response.findAll({
      where: { formId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ responses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/responses/export/:formId → preuzimanje kao .xlsx
exports.exportResponsesToExcel = async (req, res) => {
  try {
    const { formId } = req.params;

    // Proveri pristup
    const form = await Form.findByPk(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const isOwner = form.ownerId === req.user.id;
    const isEditorOrViewer = !!(await Collaborator.findOne({
      where: { formId, userId: req.user.id }
    }));

    if (!isOwner && !isEditorOrViewer) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Dohvati pitanja i odgovore
    const questions = await Question.findAll({
      where: { formId },
      order: [['order', 'ASC']]
    });

    const responses = await Response.findAll({
      where: { formId }
    });

    // Pripremi podatke za Excel
    const worksheetData = [];

    // Zaglavlje
    const headers = ['Submission ID', 'Submitted At'];
    questions.forEach(q => headers.push(q.text));
    worksheetData.push(headers);

    // Redovi
    responses.forEach(r => {
      const row = [r.id, new Date(r.createdAt).toLocaleString()];
      const answerMap = {};
      r.answers.forEach(a => {
        answerMap[a.questionId] = a.answer;
      });

      questions.forEach(q => {
        let value = answerMap[q.id];
        if (Array.isArray(value)) value = value.join(', ');
        row.push(value || '');
      });

      worksheetData.push(row);
    });

    // Kreiraj Excel
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');

    // Generiši buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Pošalji kao download
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=form-${formId}-responses.xlsx`
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};