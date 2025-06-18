const { Op } = require("sequelize"); // Import the "Op" (Operators) from Sequelize for complex query conditions
const sequelize = require("../utils/database.js"); // Import the Sequelize database instance for querying
const Company = require("../models/company.js"); // Import the "Company" model
const Address = require("../models/Address.js"); // Import the "Address" model
const Contacts = require("../models/contacts.js"); // Import the "Contacts" model
const MeetingLog = require("../models/meetingLog.js"); // Import the "MeetingLog" model
const manageCP = require("../models/manageCP.js");
const Department = require("../models/departments.js");

/**
  This function performs a search operation for companies based on a search term
  provided by the user. It fetches all matching companies and their related
  addresses, contacts, and meeting logs from the database.
 * @param {Object} req - The request object from the client.
 * @param {Object} res - The response object to send the result back to the client.
 */
const searchCompany = async (req, res) => {
  // Extract search term from the query parameters (GET request). Default is an empty string if no search term is provided.
  const search = req.query.search || "";

  // Log the search query for debugging purposes
  console.log("Query Parameters:", { search });

  try {
    let whereCondition = {}; // Initialize the where condition for the database query

    // If a search term exists, create a 'where' condition that matches any records
    // where the company name (nameOfCompany) matches the search term (case-insensitive)
    if (search) {
      whereCondition = {
        [Op.or]: [
          sequelize.where(
            // Use the "lower" function to perform a case-insensitive match on the "nameOfCompany" field
            sequelize.fn("lower", sequelize.col("Company.nameOfCompany")),
            { [Op.like]: `%${search.toLowerCase()}%` } // Use SQL LIKE operator with wildcards for partial matching
          ),
        ],
      };
    }

    // Log the constructed 'where' condition for debugging purposes
    console.log("Where Condition:", whereCondition);

    // Query the database for companies matching the search condition
    const records = await Company.findAll({
      where: whereCondition, // Apply the where condition
      include: [
        {
          model: Address, // Include related addresses
          as: "addresses", // Use alias "addresses"
          include: [
            {
              model: Contacts, // Include related contacts under each address
              as: "contacts", // Use alias "contacts"
              include: [
                {
                  model: Department, // Including 'Department' model linked to 'Contacts'
                  as: "departments", // Alias used to refer to the department relation in the Contacts model
                },
                {
                  model: MeetingLog, // Include related meeting logs under each contact
                  as: "meetinglog", // Use alias "meetinglog"
                },
              ],
            },
          ],
        },
        {
          model: manageCP,
          as: "manageCP",
        },
      ],
    });

    // Log the fetched records for debugging purposes
    console.log("Records:", records);

    // Send the retrieved records as a JSON response with a 200 status code
    res.status(200).json({
      data: records,
    });
  } catch (error) {
    // Log any error that occurs during database query execution
    console.error("Error fetching data from database: ", error);

    // Send a 500 status code with an error message in case of failure
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getCompanyById = async (req, res) => {
  // Extract companyNumber from the query parameters
  const companyNumber = req.query.companyNumber;

  // Log the company number for debugging purposes
  console.log("Query Parameters:", { companyNumber });

  try {
    if (!companyNumber) {
      // If companyNumber is not provided, return a 400 Bad Request response
      return res.status(400).json({ error: "Company number is required" });
    }

    // Query the database for the company that matches the given companyNumber
    const company = await Company.findOne({
      where: {
        companyNumber: companyNumber, // Match by company number
      },
      include: [
        {
          model: Address,
          as: "addresses",
          include: [
            {
              model: Contacts,
              as: "contacts",
              include: [
                {
                  model: Department,
                  as: "departments",
                },
                {
                  model: MeetingLog,
                  as: "meetinglog",
                },
              ],
            },
          ],
        },
        {
          model: manageCP,
          as: "manageCP",
        },
      ],
    });

    // Check if the company was found
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Log the fetched company for debugging purposes
    console.log("Company:", company);

    // Send the retrieved company data as a JSON response with a 200 status code
    res.status(200).json({
      data: company,
    });
  } catch (error) {
    // Log any error that occurs during database query execution
    console.error("Error fetching company from database: ", error);

    // Send a 500 status code with an error message in case of failure
    res
      .status(500)
      .json({ error: "An error occurred while fetching the company data" });
  }
};

const searchContacts = async (req, res) => {
  const searchTerm = req.query.search || ""; // Extract search term from the query parameters

  console.log("Query Parameters:", { searchTerm });

  try {
    // Find contacts based on the search term
    const contactResults = await Contacts.findAll({
      where: {
        [Op.or]: [
          { contactPersonName: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } }, // You can add more fields as needed
        ],
      },
      include: [
        {
          model: Address,
          as: "addresses", // Include related address details
          include: [
            {
              model: Company,
              as: "company",
              include: {
                model: manageCP,
                as: "manageCP",
              },
            },
          ],
        },
        {
          model: MeetingLog,
          as: "meetinglog", // Include related meeting logs
          required: false,
        },
      ],
    });

    // Log the fetched records for debugging purposes
    console.log("Contact Records:", contactResults);

    // If related contacts are found, respond with a 200 OK status and the found contacts
    if (contactResults.length > 0) {
      return res
        .status(200)
        .json({ message: "Contacts Found", data: contactResults });
    }

    // If no contacts are found, respond with a 404 Not Found status
    res
      .status(404)
      .json({ message: "No Contacts found matching the search term" });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error while fetching data from database: ", error);

    // Respond with a 500 Internal Server Error and a descriptive message
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = {
  searchCompany, // Export the searchCompany function for use in other parts of the application
  searchContacts,
  getCompanyById,
};
