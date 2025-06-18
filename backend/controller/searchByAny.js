// Import Sequelize's `Op` (operators) for handling advanced query options
const { Op } = require("sequelize");
// Import the Sequelize instance for database connection (though not directly used in this file)
const sequelize = require("../utils/database.js");
// Import models to perform queries on these tables
const Company = require("../models/company.js");
const Address = require("../models/Address.js");
const Contacts = require("../models/contacts.js");
const MeetingLog = require("../models/meetingLog.js");
const manageCP = require("../models/manageCP.js");

/**
 Controller function to search records by any field in the Company, Address, Contacts, or MeetingLog models.
 It builds a dynamic search condition based on the user's input and queries the database to find matches.
 *@param {Object} req - Express request object, contains query parameter `search` for search input
 *@param {Object} res - Express response object, used to send back the search results or errors
 */
const searchByAnyField = async (req, res) => {
  // Get the search query from the request, if not present, default to an empty string
  const search = req.query.search || "";

  // Log the query parameter for debugging
  console.log("Query Parameters:", { search });

  try {
    // Initialize an empty condition for the search, will be populated if search input exists
    let whereCondition = {};

    // If the user has provided a search string, build the `whereCondition` dynamically
    if (search) {
      whereCondition = {
        [Op.or]: [
          // Sequelize `Op.or` is used to search in multiple fields, matching any of them
          // Convert each searchable field to lowercase and match using the LIKE operator
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.companyNumber")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.nameOfCompany")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.companyWebsite")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.linkdinProfile")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.category")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.isClientActive")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.toWhom")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.date")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.reason")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.remark")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.frontdeskAddress")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.tallyAddress")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.departments")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.toEmails")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.ccEmailsRKD")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Company.ccEmailsClients")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Address.companyNumber")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.salutation")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.contactPersonName")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.designation")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.department")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.email")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.officialMobile")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.personalMobile")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.linkdinProfile")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.typeOfBusiness")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.AddressNumber")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("Contacts.remarks")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn(
              "lower",
              sequelize.col("Contacts.preferredModeOfCommunication")
            ),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("MeetingLog.date")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("MeetingLog.place")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("MeetingLog.conference")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("MeetingLog.remarks")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("lower", sequelize.col("MeetingLog.contactNumber")),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
        ],
      };
    }

    // Log the constructed search condition for debugging purposes
    console.log("Where Condition:", whereCondition);

    // Query the Company table with the built `whereCondition`, and include associated Address, Contacts, and MeetingLog data
    const records = await Company.findAll({
      where: whereCondition, // Apply the search condition
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

    // Log the fetched records for debugging
    console.log("Records:", records);

    // Return the found records as JSON with a success (200) status
    res.status(200).json({
      data: records,
    });
  } catch (error) {
    // If an error occurs, log the error and send a 500 error response with a descriptive message
    console.error("Error fetching data from database: ", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

// Export the function for use in other parts of the application
module.exports = {
  searchByAnyField,
};
