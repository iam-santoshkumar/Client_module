// Import the Sequelize library, which is an ORM (Object-Relational Mapping) for Node.js
const { Sequelize } = require("sequelize");

// Create a new instance of Sequelize to connect to a MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, // Host where the database is running
  port: process.env.DB_PORT, // Port number for the MySQL database
  dialect: "mysql", // Specify the database dialect to use (MySQL in this case)

  // Logging options for Sequelize
  logging: (msg) => console.log(`[Sequelize]: ${msg}`), // Custom logging function to format logs
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate(); // Test the connection
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Call the testConnection function
testConnection();
// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;
