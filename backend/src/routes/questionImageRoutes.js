const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { Question, Form, Collaborator } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// POST /api/questions/:id/upload-image
router.post(
  "/:id/upload-image",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findByPk(id);
      if (!question) {
        return res.status(404).json({ message: "Pitanje nije pronađeno" });
      }

      // Proveri da li korisnik može uređivati formu
      const permission = await canEditForm(question.formId, req.user.id);
      if (!permission.can) {
        return res.status(403).json({ message: permission.error });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Nijedna slika nije upload-ovana" });
      }

      // Generiši URL za sliku (klijent će moći da je učita direktno)
      const imageUrl = `/uploads/questions/${req.file.filename}`;

      // Ažuriraj pitanje
      await question.update({ imageUrl });

      res.json({ imageUrl });
    } catch (err) {
      if (err.message.includes('Samo slike')) {
        return res.status(400).json({ message: err.message });
      }
      console.error(err);
      res.status(500).json({ message: "Greška na serveru" });
    }
  }
);

// Pomoćna funkcija za proveru pristupa
const canEditForm = async (formId, userId) => {
  const form = await Form.findByPk(formId);
  if (!form) return { can: false, error: "Forma nije pronađena" };

  if (form.ownerId === userId) return { can: true };

  const collaborator = await Collaborator.findOne({
    where: { formId, userId, role: "editor" }
  });

  return collaborator ? { can: true } : { can: false, error: "Nemaš pravo uređivanja" };
};

module.exports = router;