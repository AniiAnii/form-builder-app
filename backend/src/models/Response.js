const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
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
    type: DataTypes.STRING(255),
    allowNull: true, // Allow null for guest responses
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
  }
}, {
  tableName: "responses",
  timestamps: true,
});

Response.belongsTo(Form, { foreignKey: "formId" });



module.exports = Response;