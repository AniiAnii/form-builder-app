const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Form = require("./Form");

const Collaborator = sequelize.define("Collaborator", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'User',
      key: "id",
    },
    onDelete: "CASCADE",
  },
  formId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Form',
      key: "id",
    },
    onDelete: "CASCADE",
  },
  role: {
    type: DataTypes.ENUM("editor", "viewer"),
    allowNull: false,
  },
}, {
  tableName: "collaborators",
  timestamps: true,
});

// Relacije
User.belongsToMany(Form, { through: Collaborator, foreignKey: "userId" });
Form.belongsToMany(User, { through: Collaborator, foreignKey: "formId" });

module.exports = Collaborator;