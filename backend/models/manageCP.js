// Importing necessary modules from Sequelize ORM
const { Model, DataTypes } = require("sequelize");
// Importing the Sequelize instance configured with the database connection
const sequelize = require("../utils/database.js");

// Defining the manageCP model by extending the Sequelize Model class
class manageCP extends Model {
  // This static method defines associations with other models
  static associate(models) {
    // Defining a many-to-one relationship between manageCP and Company
    manageCP.belongsTo(models.Company, {
      foreignKey: "companyNumber", // Foreign key in the manageCP table that references the Company table
      targetKey: "companyNumber", // Primary key in the Company table that is referenced
      as: "company", // Aliasing the relationship as 'company'
    });
  }
}

// Initializing the manageCP model with its attributes (columns in the database table)
manageCP.init(
  {
    // 'id' as the primary key and auto-increment field
    id: {
      type: DataTypes.INTEGER, // Data type is an integer
      primaryKey: true, // Marking it as the primary key
      autoIncrement: true, // Auto-increments for each new record
      allowNull: false, // This field cannot be null
    },
    // 'departments' stores the department information
    departments: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    subdepart: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 'toEmails' stores the recipient email addresses
    toEmails: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'ccEmailsRKD' stores the CC email addresses for RKD
    ccEmailsRKD: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'ccEmailsClients' stores the CC email addresses for clients
    ccEmailsClients: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 'companyNumber' is a foreign key that links to the company this manageCP belongs to
    companyNumber: {
      type: DataTypes.INTEGER, // Data type is an integer
      allowNull: false, // This field is mandatory (non-nullable)
    },
  },
  {
    sequelize, // Connecting the model to the Sequelize instance (database)
    timestamps: false, // Disabling automatic timestamp fields like createdAt and updatedAt
    modelName: "manageCP", // Name of the model within Sequelize
    tableName: "manage_cp", // Explicitly specifying the table name in the database
  }
);

// Exporting the manageCP model so it can be used in other parts of the application
module.exports = manageCP;
