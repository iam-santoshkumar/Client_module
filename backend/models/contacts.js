// Importing necessary modules from Sequelize ORM
const { Model, DataTypes } = require("sequelize");

// Importing the Sequelize instance configured with the database connection
const sequelize = require("../utils/database.js");

// Defining the Contacts model by extending the Sequelize Model class
class Contacts extends Model {
  // This static method defines associations with other models
  static associate(models) {
    // Defining a many-to-one relationship between Contacts and Address
    // Each contact is associated with one address
    Contacts.belongsTo(models.Address, {
      foreignKey: "AddressNumber", // Foreign key in the Contacts table that references the Address table
      targetKey: "id", // Primary key in the Address table that is referenced
      as: "addresses", // Aliasing the relationship as 'addresses'
    });


    Contacts.hasMany(models.Department, {
      as: "departments", // Aliasing the relationship as 'meetinglog'
      foreignKey: "contactId", // Foreign key in the MeetingLog table that references the Contacts table
      sourceKey: "id", // Primary key in the Contacts table used as source
    });

    // Defining a one-to-many relationship between Contacts and MeetingLog
    // Each contact can have multiple meeting logs
    Contacts.hasMany(models.MeetingLog, {
      as: "meetinglog", // Aliasing the relationship as 'meetinglog'
      foreignKey: "contactNumber", // Foreign key in the MeetingLog table that references the Contacts table
      sourceKey: "id", // Primary key in the Contacts table used as source
    });
  }
}

// Initializing the Contacts model with its attributes (columns in the database table)
Contacts.init(
  {
    // Defining 'id' as the primary key and auto-increment field
    id: {
      type: DataTypes.INTEGER, // Data type is an integer
      primaryKey: true, // Marking it as the primary key
      autoIncrement: true, // Auto-increments for each new record
      allowNull: false, // This field cannot be null
    },
    // 'salutation' represents the contact person's title (e.g., Mr., Ms., Dr.)
    salutation: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'contactPersonName' stores the full name of the contact person
    contactPersonName: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
    // 'designation' stores the job title of the contact person (e.g., Manager)
    designation: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'email' stores the official email address of the contact person
    email: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    officialMobile_code: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'officialMobile' stores the official mobile number of the contact person
    officialMobile: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    personalMobile_code: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'personalMobile' stores the personal mobile number of the contact person
    personalMobile: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'linkdinProfile' stores the LinkedIn profile URL of the contact person
    linkdinProfile: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'typeOfBusiness' indicates the type of business the contact person is involved in (e.g., Supplier, Client)
    // department: {
    //   type: DataTypes.STRING, // Data type is a string
    //   allowNull: false, // This field is mandatory (non-nullable)
    // },
    // 'AddressNumber' is a foreign key that links the contact person to a specific address
    AddressNumber: {
      type: DataTypes.INTEGER, // Data type is an integer
      allowNull: false, // This field is mandatory (non-nullable)
    },
    whatsappNumber_code: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },

    // 'whatsappNumber' stores the WhatsApp number of the contact person
    whatsappNumber: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'remarks' stores any additional remarks or comments related to the contact
    remarks: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'preferredModeOfCommunication' indicates the contact person's preferred communication channel (e.g., email, phone, WhatsApp)
    preferredModeOfCommunication: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: false, // This field is mandatory (non-nullable)
    },
  },
  {
    sequelize, // Connecting the model to the Sequelize instance (database)
    tableName: "contacts", // Explicitly specifying the table name in the database
    modelName: "Contacts", // Name of the model within Sequelize
    timestamps: false, // Disabling automatic timestamp fields like createdAt and updatedAt
  }
);

// Exporting the Contacts model so it can be used in other parts of the application
module.exports = Contacts;
