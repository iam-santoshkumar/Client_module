// Importing necessary modules from Sequelize ORM
const { Model, DataTypes } = require("sequelize");

// Importing the Sequelize instance configured with database connection
const sequelize = require("../utils/database.js");

// Defining the Company model by extending the Sequelize Model class
class Company extends Model {
  // This static method is used to define associations with other models
  static associate(models) {
    // Defining a one-to-many relationship between Company and Address models
    // A company can have multiple addresses
    Company.hasMany(models.Address, {
      as: "addresses", // Aliasing the relationship as 'addresses'
      foreignKey: "companyNumber", // Foreign key in Address table that references Company
      sourceKey: "companyNumber", // Primary key in Company table used as source
    });

    Company.hasMany(models.manageCP, {
      as: "manageCP", // Aliasing the relationship as 'addresses'
      foreignKey: "companyNumber", // Foreign key in Address table that references Company
      sourceKey: "companyNumber", // Primary key in Company table used as source
    });

    Company.hasMany(models.UpdateInfo, {
      as: "update_info",
      foreignKey: "companyNumber",
      sourceKey: "companyNumber",
    });
  }
}

// Initializing the Company model with its attributes (columns in the database table)
Company.init(
  {
    // Defining 'companyNumber' as the primary key and auto-increment field
    companyNumber: {
      type: DataTypes.INTEGER, // Data type is an integer
      primaryKey: true, // Marking it as the primary key
      autoIncrement: true, // Auto-increments for each new record
      allowNull: false, // This field cannot be null
    },
    // 'nameOfCompany' stores the name of the company
    nameOfCompany: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
      // primaryKey: true,
    },
    // 'companyWebsite' stores the website URL of the company
    companyWebsite: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'companyEmail' stores the company's email address
    companyEmail: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'companyTelephone' stores the company's telephone number
    companyTelephone: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'linkdinProfile' stores the company's LinkedIn profile link
    linkdinProfile: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'category' defines the type/category of the company
    category: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'sector' represents the business sector the company operates in
    sector: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'subsector' is a more specific classification within the sector
    subsector: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'isClientActive' indicates if the client is currently active or not
    isClientActive: {
      type: DataTypes.STRING, // Data type is a string (Active or InActive)
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'toWhom' specifies the recipient or person responsible in the company
    toWhom: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'date' indicates when the company was added or last updated
    date: {
      type: DataTypes.STRING, // Data type is a string (could store date as a string)
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'reason' stores the reason for the company's registration or other actions
    reason: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'remark' stores additional remarks or comments related to the company
    remark: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'frontdeskAddress' stores the front desk address for the company
    frontdeskAddress: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'tallyAddress' stores the address used for tallying purposes
    tallyAddress: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    addedBy: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true,
    },
  },
  {
    sequelize, // Connecting the model to the Sequelize instance (database)
    timestamps: false, // Disabling automatic timestamp fields like createdAt and updatedAt
    modelName: "Company", // Name of the model within Sequelize
    tableName: "company", // Explicitly specifying the table name in the database
  }
);

// Exporting the Company model so it can be used in other parts of the application
module.exports = Company;
