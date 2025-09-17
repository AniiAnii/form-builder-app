const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Form = require("./Form");

const Response = sequelize.define("Response", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  formId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'forms',
      key: "id",
    },
    onDelete: "CASCADE",
  },
  submittedBy: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'users',
      key: "id",
    },
    onDelete: "SET NULL",
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: "responses",
  timestamps: true,
});

Response.belongsTo(Form, { foreignKey: "formId" });
Response.belongsTo(User, { foreignKey: "submittedBy" });

module.exports = Response;