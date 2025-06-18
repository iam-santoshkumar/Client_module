// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import necessary packages
const express = require("express"); // Framework for building web applications
const bodyParser = require("body-parser"); // Middleware for parsing request bodies

const sequelize = require("./utils/database.js"); // Database connection instance
const apiRoutes = require("./routes/api.js"); // API routes for the application
const cors = require("cors"); // Middleware for enabling Cross-Origin Resource Sharing

// Importing models to be used in the application
const Company = require("./models/company.js");
const Address = require("./models/Address.js");
const Contacts = require("./models/contacts.js");
const MeetingLog = require("./models/meetingLog.js");
const manageCP = require("./models/manageCP.js");
const User = require("./models/user.js");
const UpdateInfo = require("./models/UpdateInfo.js");
const Department = require("./models/departments.js");

// Create an instance of Express
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
// Enable CORS for the application
app.use(
  cors({ origin: ["http://192.168.34.50:3000", "http://192.168.1.110:3004"] })
);
// Set up the API routes under the "/api" prefix
app.use("/api", apiRoutes);

// Define a models object to hold associations for the models
const models = {
  Company: Company,
  Address: Address,
  Contacts: Contacts,
  MeetingLog: MeetingLog,
  manageCP: manageCP,
  User: User,
  UpdateInfo: UpdateInfo,
  Department: Department,
};

// Establish associations between models
Company.associate(models); // Define relationships for the Company model
Address.associate(models); // Define relationships for the Address model
Contacts.associate(models); // Define relationships for the Contacts model
MeetingLog.associate(models); // Define relationships for the MeetingLog model
manageCP.associate(models);
UpdateInfo.associate(models);
Department.associate(models);
//User.associate(models);

// Define the port on which the server will run
const port = 8000;

// Synchronize the database and its models
sequelize
  .sync() // Syncs the database with the defined models
  .then(() => {
    // Success callback
    console.log("Database & tables synced"); // Log success message
    // Start the Express server and listen on the defined port
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`); // Log server start message
    });
  })
  .catch((error) => {
    // Error handling callback
    console.error("Error syncing database:", error); // Log any errors during synchronization
  });
