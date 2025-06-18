// Importing necessary modules from Sequelize ORM
const { Model, DataTypes } = require("sequelize");

// Importing the Sequelize instance configured with the database connection
const sequelize = require("../utils/database.js");

// Defining the Address model by extending the Sequelize Model class
class Address extends Model {
  // This static method defines associations with other models
  static associate(models) {
    // Defining a many-to-one relationship between Address and Company
    // Each address belongs to one company
    Address.belongsTo(models.Company, {
      foreignKey: "companyNumber", // Foreign key in the Address table that references the Company table
      targetKey: "companyNumber", // Primary key in the Company table that is referenced
      as: "company", // Aliasing the relationship as 'company'
    });

    // Defining a one-to-many relationship between Address and Contacts
    // Each address can have multiple contacts
    Address.hasMany(models.Contacts, {
      as: "contacts", // Aliasing the relationship as 'contacts'
      foreignKey: "AddressNumber", // Foreign key in the Contacts table that references the Address table
      sourceKey: "id", // Primary key in the Address table used as source
    });
  }
}

// Initializing the Address model with its attributes (columns in the database table)
Address.init(
  {
    // Defining 'id' as the primary key and auto-increment field
    id: {
      type: DataTypes.INTEGER, // Data type is an integer
      primaryKey: true, // Marking it as the primary key
      autoIncrement: true, // Auto-increments for each new record
      allowNull: false, // This field cannot be null
    },
    // 'companyAddress' stores the address of the company
    companyAddress: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'city' stores the city where the company is located
    city: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'state' stores the state where the company is located
    state: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'country' stores the country where the company is located
    country: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'pincode' stores the postal code for the address
    pincode: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'officeTelephone' stores the office phone number for the address
    officeTelephone: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'fieldOfActivity' represents the area of activity or operation for the address
    remarks: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is mandatory (non-nullable)
    },
    typeOfBusiness: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, 
    },
    // 'companyNumber' is a foreign key that links to the company this address belongs to
    companyNumber: {
      type: DataTypes.INTEGER, // Data type is an integer
      allowNull: false, // This field is mandatory (non-nullable)
    },
  },
  {
    sequelize, // Connecting the model to the Sequelize instance (database)
    timestamps: false, // Disabling automatic timestamp fields like createdAt and updatedAt
    modelName: "Address", // Name of the model within Sequelize
    tableName: "address", // Explicitly specifying the table name in the database
  }
);

// Exporting the Address model so it can be used in other parts of the application
module.exports = Address;
