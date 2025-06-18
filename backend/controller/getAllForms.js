// Importing required models: 'Company', 'Address', 'Contacts', and 'MeetingLog'
const Company = require("../models/company.js");
const Address = require("../models/Address.js");
const Contacts = require("../models/contacts.js");
const MeetingLog = require("../models/meetingLog.js");
const ManageCP = require("../models/manageCP.js");
const Department = require("../models/departments.js");

/**
 * Function to fetch all forms (companies) along with their associated addresses, contacts, and meeting logs.
 * This function performs a JOIN operation to gather related data from different models.
 * It uses the Sequelize `findAll` method to retrieve all records from the 'Company' table.
 */
const getAllForms = async (req, res) => {
  try {
    // Fetching all companies and their associated addresses, contacts, and meeting logs using Sequelize's `include` option.
    const forms = await Company.findAll({
      include: [
        {
          model: Address, // Including 'Address' model linked to 'Company'
          as: "addresses", // Alias used to refer to the addresses relation in the Company model
          include: [
            {
              model: Contacts, // Including 'Contacts' model linked to 'Address'
              as: "contacts", // Alias used to refer to the contacts relation in the Address model
              include: [
                {
                  model: Department, // Including 'Department' model linked to 'Contacts'
                  as: "departments", // Alias used to refer to the department relation in the Contacts model
                },
                {
                  model: MeetingLog, // Including 'MeetingLog' model linked to 'Contacts'
                  as: "meetinglog", // Alias used to refer to the meetinglog relation in the Contacts model
                },
              ],
            },
          ],
        },
        {
          model: ManageCP,
          as: "manageCP",
        },
      ],
    });

    // Sending the fetched data as JSON response with a 200 success status
    res.status(200).json({ data: forms });
  } catch (error) {
    // If any error occurs, log it and send a 500 error response with a descriptive message
    console.error("Error fetching data from database: ", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

/*
  Function to fetch a specific company based on the 'companyNumber'.
  This function retrieves a single company along with its associated addresses, contacts, and meeting logs.
  It uses the Sequelize `findOne` method to retrieve the company where the 'companyNumber' matches.
 */
const getByCompanyNumber = async (req, res) => {
  // Extracting the 'companyNumber' from the request parameters
  const companyNumber = req.params.companyNumber;

  try {
    // Fetching the company with the specified 'companyNumber' and its related data (addresses, contacts, meeting logs)
    const company = await Company.findOne({
      where: { companyNumber }, // The 'where' condition specifies the companyNumber to search for
      include: [
        {
          model: Address, // Including 'Address' model linked to 'Company'
          as: "addresses", // Alias used to refer to the addresses relation in the Company model
          include: [
            {
              model: Contacts, // Including 'Contacts' model linked to 'Address'
              as: "contacts", // Alias used to refer to the contacts relation in the Address model
              include: [
                {
                  model: Department, // Including 'Department' model linked to 'Contacts'
                  as: "departments", // Alias used to refer to the department relation in the Contacts model
                },
                {
                  model: MeetingLog, // Including 'MeetingLog' model linked to 'Contacts'
                  as: "meetinglog", // Alias used to refer to the meetinglog relation in the Contacts model
                },
              ],
            },
          ],
        },
        {
          model: ManageCP,
          as: "manageCP",
        },
      ],
    });

    // If no company is found, send a 404 error response with a message
    if (!company) {
      return res.status(404).json({
        error: `Company with companyNumber ${companyNumber} not found`,
      });
    }

    // If company is found, send the company data as JSON with a 200 success status
    res.status(200).json({ data: company });
  } catch (error) {
    // If any error occurs during the fetching process, log it and send a 500 error response with a message
    console.error(
      `Error fetching company with companyNumber ${companyNumber}: `,
      error
    );
    res
      .status(500)
      .json({ error: "An error occurred while fetching company data" });
  }
};

// Exporting the 'getAllForms' and 'getByCompanyNumber' functions so they can be used in other parts of the application
module.exports = {
  getAllForms,
  getByCompanyNumber,
};
