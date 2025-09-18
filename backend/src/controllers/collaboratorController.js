const { Form, User, Collaborator } = require("../models");

// Provera: da li je korisnik vlasnik forme?
const isOwner = async (formId, userId) => {
  const form = await Form.findByPk(formId);
  return form && form.ownerId === userId;
};

// POST /api/collaborators
exports.addCollaborator = async (req, res) => {
  try {
    const { formId, email, role } = req.body;

    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Use 'editor' or 'viewer'" });
    }

    // Proveri da li je trenutni korisnik vlasnik
    if (!(await isOwner(formId, req.user.id))) {
      return res.status(403).json({ message: "Only owner can add collaborators" });
    }

    // Nađi korisnika po email-u
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ne dozvoli dodavanje vlasnika kao kolaboratora
    if (user.id === req.user.id) {
      return res.status(400).json({ message: "You are the owner" });
    }

    // Proveri da li već postoji
    const existing = await Collaborator.findOne({ where: { formId, userId: user.id } });
    if (existing) {
      return res.status(409).json({ message: "User is already a collaborator" });
    }

    // Dodaj kolaboratora
    const collaborator = await Collaborator.create({
      formId,
      userId: user.id,
      role
    });

    res.status(201).json({ collaborator, message: `${role} added successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/collaborators/:id
exports.removeCollaborator = async (req, res) => {
  try {
    const { id } = req.params; // id kolaboracije

    const collaborator = await Collaborator.findByPk(id);
    if (!collaborator) return res.status(404).json({ message: "Collaborator not found" });

    // Proveri da li je trenutni korisnik vlasnik forme
    if (!(await isOwner(collaborator.formId, req.user.id))) {
      return res.status(403).json({ message: "Only owner can remove collaborators" });
    }

    // Ne dozvoli uklanjanje sebe
    if (collaborator.userId === req.user.id) {
      return res.status(400).json({ message: "You cannot remove yourself as owner" });
    }

    await collaborator.destroy();
    res.json({ message: "Collaborator removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/collaborators/form/:formId
exports.getCollaboratorsByForm = async (req, res) => {
  try {
    const { formId } = req.params;

    // Proveri pristup: samo vlasnik i kolaboratori
    const form = await Form.findByPk(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const isOwnerOrCollaborator = form.ownerId === req.user.id || 
      !!(await Collaborator.findOne({ where: { formId, userId: req.user.id } }));

    if (!isOwnerOrCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    const collaborators = await Collaborator.findAll({
      where: { formId },
      include: [User],
      attributes: ['id', 'role', 'createdAt'],
      order: [['role', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({ collaborators });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};