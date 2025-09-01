const express = require("express"); 

const router = express.Router(); 

const { createForm, getMyForms } = require("../controllers/formController"); 

const authMiddleware = require("../middleware/authMiddleware"); 

 

router.post("/", authMiddleware, createForm); 

router.get("/", authMiddleware, getMyForms); 

 

module.exports = router; 