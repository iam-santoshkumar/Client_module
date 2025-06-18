// Importing necessary modules from Sequelize ORM
const { Model, DataTypes } = require("sequelize");

// Importing the Sequelize instance configured with the database connection
const sequelize = require("../utils/database.js");

// Defining the MeetingLog model by extending the Sequelize Model class
class MeetingLog extends Model {
  // This static method defines associations with other models
  static associate(models) {
    // Defining a many-to-one relationship between MeetingLog and Contacts
    // Each meeting log is associated with one contact
    MeetingLog.belongsTo(models.Contacts, {
      foreignKey: "contactNumber", // Foreign key in the MeetingLog table that references the Contacts table
      targetKey: "id", // Primary key in the Contacts table that is referenced
      as: "contacts", // Aliasing the relationship as 'contacts'
    });
  }
}

// Initializing the MeetingLog model with its attributes (columns in the database table)
MeetingLog.init(
  {
    // Defining 'id' as the primary key and auto-increment field
    id: {
      type: DataTypes.INTEGER, // Data type is an integer
      primaryKey: true, // Marking it as the primary key
      autoIncrement: true, // Auto-increments for each new record
      allowNull: false, // This field cannot be null
    },
    // 'date' stores the date of the meeting or conference
    date: {
      type: DataTypes.STRING, // Data type is a string (consider using DATE or DATETIME for date fields)
      allowNull: true, // This field is optional (nullable)
    },
    // 'place' stores the location where the meeting took place
    place: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'conference' stores details of the conference or meeting type
    conference: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'remarks' stores any additional comments or notes about the meeting
    remarks: {
      type: DataTypes.STRING, // Data type is a string
      allowNull: true, // This field is optional (nullable)
    },
    // 'contactNumber' is a foreign key linking the meeting log to a specific contact
    contactNumber: {
      type: DataTypes.INTEGER, // Data type is an integer
      allowNull: false, // This field is mandatory (non-nullable)
    },
  },
  {
    sequelize, // Connecting the model to the Sequelize instance (database)
    tableName: "meetinglog", // Explicitly specifying the table name in the database
    modelName: "MeetingLog", // Name of the model within Sequelize
    timestamps: false, // Disabling automatic timestamp fields like createdAt and updatedAt
  }
);

// Exporting the MeetingLog model so it can be used in other parts of the application
module.exports = MeetingLog;
