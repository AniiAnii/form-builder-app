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
  shareToken: {
    type: DataTypes.STRING(36), // UUID format
    allowNull: false,
    unique: true,
  },
}, { 
  tableName: "forms", 
  timestamps: true, 
}); 

// Generate shareToken if not provided
Form.addHook('beforeCreate', async (form) => {
  if (!form.shareToken) {
    const crypto = require('crypto');
    form.shareToken = crypto.randomBytes(18).toString('hex'); // 36 characters
  }
});

Form.belongsTo(User, { foreignKey: "ownerId" }); 

module.exports = Form;