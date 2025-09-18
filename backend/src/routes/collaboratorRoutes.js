const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware); // sve rute zahtevaju login

router.post("/", collaboratorController.addCollaborator);
router.delete("/:id", collaboratorController.removeCollaborator);
router.get("/form/:formId", collaboratorController.getCollaboratorsByForm);

module.exports = router;