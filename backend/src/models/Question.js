const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Form = require("./Form");

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  formId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Form,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(512),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM(
      "shortText",
      "longText",
      "singleChoice",
      "multipleChoice",
      "numeric",
      "date",
      "time"
    ),
    allowNull: false,
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  minChoices: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1 }
  },
  step: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  rangeFrom: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  rangeTo: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: "questions",
  timestamps: true,
});

Form.hasMany(Question, { foreignKey: "formId" });
Question.belongsTo(Form, { foreignKey: "formId" });

module.exports = Question;