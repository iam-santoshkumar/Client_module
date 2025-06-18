// Importing necessary modules from Sequelize ORM
const { Model, DataTypes } = require("sequelize");
// Importing the Sequelize instance configured with the database connection
const sequelize = require("../utils/database.js");

// Defining the UpdateInfo model by extending the Sequelize Model class
class UpdateInfo extends Model {
  // This static method defines associations with other models
  static associate(models) {
    // Defining a many-to-one relationship between UpdateInfo and Company
    UpdateInfo.belongsTo(models.Company, {
      foreignKey: "companyNumber", // Foreign key in the UpdateInfo table that references the Company table
      targetKey: "companyNumber", // Primary key in the Company table that is referenced
      as: "company", // Aliasing the relationship as 'company'
    });
  }
}

// Initializing the UpdateInfo model with its attributes (columns in the database table)
UpdateInfo.init(
  {
    // 'info_id' as the primary key and auto-increment field
    info_id: {
      type: DataTypes.INTEGER, // Data type is an integer
      primaryKey: true, // Marking it as the primary key
      autoIncrement: true, // Auto-increments for each new record
      allowNull: false, // This field cannot be null
    },
    // 'addedBy' stores who added the information
    addedBy: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'updatedBy' stores who updated the information
    updatedBy: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'created_at' stores the timestamp when the record was created
    created_at: {
      type: DataTypes.DATE, // Data type is a date
      allowNull: false, // This field is mandatory (non-nullable)
      defaultValue: DataTypes.NOW, // Default value is the current timestamp
    },
    // 'updated_at' stores the timestamp when the record was last updated
    updated_at: {
      type: DataTypes.DATE, // Data type is a date
      allowNull: false, // This field is mandatory (non-nullable)
      defaultValue: DataTypes.NOW, // Default value is the current timestamp
    },
    // 'companyNumber' is a foreign key that links to the company this UpdateInfo belongs to
    companyNumber: {
      type: DataTypes.INTEGER, // Data type is an integer
      allowNull: false, // This field is mandatory (non-nullable)
    },
  },
  {
    sequelize, // Connecting the model to the Sequelize instance (database)
    timestamps: false, // Disabling automatic timestamp fields like createdAt and updatedAt
    modelName: "UpdateInfo", // Name of the model within Sequelize
    tableName: "update_info", // Explicitly specifying the table name in the database
  }
);

// Exporting the UpdateInfo model so it can be used in other parts of the application
module.exports = UpdateInfo;
