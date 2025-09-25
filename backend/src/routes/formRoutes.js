const express = require("express"); 
const router = express.Router(); 
const { createForm, getMyForms } = require("../controllers/formController"); 
const authMiddleware = require("../middleware/authMiddleware"); const { Op } = require("sequelize");
router.post("/", authMiddleware, createForm);
router.get("/", authMiddleware, getMyForms); 

 // GET /api/forms/user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { ownerId: req.user.id },
      attributes: ["id", "title", "description", "createdAt"],
      include: [{
        model: Response,
        attributes: [],
        as: "responses",
      }],
      group: ["Form.id"],
      attributes: {
        include: [[sequelize.fn("COUNT", sequelize.col("responses.id")), "responsesCount"]]
      }
    });
    res.json({ forms: forms.map(f => f.get({ plain: true })) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 