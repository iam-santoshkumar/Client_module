const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/database.js");

class Department extends Model {
  static associate(models) {
    Department.belongsTo(models.Contacts, {
      foreignKey: "contactId",
      targetKey: "id",
      as: "contacts",
    });
  }
}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    department_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sub_department_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "departments",
    modelName: "Department",
    timestamps: false,
  }
);

module.exports = Department;
