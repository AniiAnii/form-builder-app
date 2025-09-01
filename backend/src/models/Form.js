const { DataTypes } = require("sequelize"); 

const sequelize = require("../config/db"); 

const User = require("./User"); 

 

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

module.exports = Form; 