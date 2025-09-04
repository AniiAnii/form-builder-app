const { DataTypes } = require("sequelize"); 

const sequelize = require("../config/db"); 

const User = require("./User"); 

//const Question = require("./Question");
//const Response = require("./Response");
//const Collaborator = require("./Collaborator");

const Form = sequelize.define("Form", { 

  id: { 

    type: DataTypes.INTEGER.UNSIGNED, 

    autoIncrement: true, 

    primaryKey: true, 

  }, 

  title: { 

    type: DataTypes.STRING(255), 

    allowNull: false, 

  }, 

  description: { 

    type: DataTypes.TEXT, 

    allowNull: true, 

  }, 

  allowGuests: { 

    type: DataTypes.BOOLEAN, 

    defaultValue: false, 

  }, 

  isLocked: { 

    type: DataTypes.BOOLEAN, 

    defaultValue: false, 

  }, 

}, { 

  tableName: "forms", 

  timestamps: true, 

}); 

 

Form.belongsTo(User, { foreignKey: "ownerId" }); 

// Relacije ka drugim modelima
//Form.hasMany(Question, { foreignKey: "formId" });
//Form.hasMany(Response, { foreignKey: "formId" });
//Form.hasMany(Collaborator, { foreignKey: "formId" });

module.exports = Form; 