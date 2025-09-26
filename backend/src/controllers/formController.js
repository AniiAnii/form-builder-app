const { Form, User } = require("../models");

exports.createForm = async (req, res) => {
  try {
    const { title, description, allowGuests } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Generate shareToken
    const crypto = require('crypto');
    const shareToken = crypto.randomBytes(18).toString('hex'); // 36 characters

    // Create form with the logged-in user as owner
    const form = await Form.create({
      title,
      description,
      allowGuests: allowGuests || false,
      ownerId: req.user.id, // This comes from authMiddleware
      shareToken // Add the generated shareToken
    });

    res.status(201).json({ 
      message: "Form created successfully", 
      form 
    });
  } catch (err) {
    console.error("Error creating form:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyForms = async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ forms });
  } catch (err) {
    console.error("Error fetching forms:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get form by ID (for editing/viewing)
exports.getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);
    
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    // Check if user is owner
    if (form.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json({ form });
  } catch (err) {
    console.error("Error fetching form:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};