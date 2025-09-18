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

  shareToken: {
    type: DataTypes.STRING(36), // UUID format
    allowNull: false,
    unique: true,
  },
}, { 

  tableName: "forms", 

  timestamps: true, 

}); 
// Generiši shareToken ako nije dat
Form.addHook('beforeCreate', async (form) => {
  if (!form.shareToken) {
    const crypto = require('crypto');
    form.shareToken = crypto.randomBytes(18).toString('hex'); // 36 karaktera
  }
});
 

Form.belongsTo(User, { foreignKey: "ownerId" }); 

// Relacije ka drugim modelima
//Form.hasMany(Question, { foreignKey: "formId" });
//Form.hasMany(Response, { foreignKey: "formId" });
//Form.hasMany(Collaborator, { foreignKey: "formId" });

module.exports = Form; 