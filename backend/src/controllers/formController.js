const Form = require("../models/Form"); 

const User = require("../models/User"); 

 

exports.createForm = async (req, res) => { 

  try { 

    const { title, description, allowGuests } = req.body; 

    const form = await Form.create({ 

      title, 

      description, 

      allowGuests, 

      ownerId: req.user.id, 

    }); 

    res.status(201).json({ form }); 

  } catch (err) { 

    res.status(500).json({ message: "Server error" }); 

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

    res.status(500).json({ message: "Server error" }); 

  } 

}; 