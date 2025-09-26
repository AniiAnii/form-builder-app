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
      model: 'forms',
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
      "shortText",      // Short text answer – up to 512 characters
      "longText",       // Long text answer – up to 4096 characters
      "singleChoice",   // Multiple choice, single answer
      "multipleChoice", // Multiple choice, multiple answers
      "numeric",        // Single numeric answer with scale
      "date",           // Date
      "time"            // Time
    ),
    allowNull: false,
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  options: {
    type: DataTypes.JSON, // For choices in single/multiple choice questions
    allowNull: true,
  },
  numericSettings: {
    type: DataTypes.JSON, // For numeric scale: { min, max, step }
    allowNull: true,
  },
  maxAnswers: { // For multiple choice - max number of answers allowed
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  answerLength: { // For text answers - max length
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: "questions",
  timestamps: true,
});

Question.belongsTo(Form, { foreignKey: "formId" });

module.exports = Question;