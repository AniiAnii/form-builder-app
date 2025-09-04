// src/models/associations.js
const Form = require("./Form");
const User = require("./User");
const Question = require("./Question");
const Response = require("./Response");
const Collaborator = require("./Collaborator");

// Forma pripada korisniku
Form.belongsTo(User, { foreignKey: "ownerId" });
User.hasMany(Form, { foreignKey: "ownerId" });

// Pitanje pripada formi
Question.belongsTo(Form, { foreignKey: "formId" });
Form.hasMany(Question, { foreignKey: "formId" });

// Odgovor pripada formi
Response.belongsTo(Form, { foreignKey: "formId" });
Form.hasMany(Response, { foreignKey: "formId" });

// Kolaborator pripada formi i korisniku
Collaborator.belongsTo(Form, { foreignKey: "formId" });
Collaborator.belongsTo(User, { foreignKey: "userId" });
Form.hasMany(Collaborator, { foreignKey: "formId" });
User.hasMany(Collaborator, { foreignKey: "userId" });

module.exports = () => {
  console.log("All associations loaded.");
};