// Importing the Sequelize instance (for database operations) and the 'Company' model
const sequelize = require("../utils/database.js");
const Company = require("../models/company.js");

/*
 Function to fetch the names of all companies from the database.
 This function retrieves only the 'nameOfCompany' field for each company.
 It uses the Sequelize `findAll` method with the `attributes` option to limit the data retrieved.
 */
const getAllCompanyNames = async (req, res) => {
  try {
    // Fetching all companies and limiting the fields to only 'nameOfCompany' using the `attributes` option
    const companies = await Company.findAll({
      attributes: ["nameOfCompany"], // This ensures only the 'nameOfCompany' field is retrieved
    });

    // Mapping through the result set to extract only the company names as an array
    const companyNames = companies.map((company) => company.nameOfCompany);

    // Sending the company names as a JSON response with a 200 success status
    res.status(200).json({
      data: companyNames, // Returning the array of company names in the response
    });
  } catch (error) {
    // If an error occurs, log the error and send a 500 error response with a descriptive message
    console.error("Error fetching company names from database: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching company names" });
  }
};

// Exporting the 'getAllCompanyNames' function so it can be used in other parts of the application
module.exports = {
  getAllCompanyNames,
};
