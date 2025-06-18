const Company = require("../models/company.js");

const deleteCompanyById = async (req, res) => {
  // Extract companyNumber from the query parameters
  const companyNumber = req.query.companyNumber;

  // Log the company number for debugging purposes
  console.log("Query Parameters:", { companyNumber });

  try {
    if (!companyNumber) {
      // If companyNumber is not provided, return a 400 Bad Request response
      return res.status(400).json({ error: "Company number is required" });
    }

    // Find and delete the company with the specified companyNumber
    const deletedCompany = await Company.destroy({
      where: {
        companyNumber: companyNumber, // Match by company number
      },
    });

    // Check if the company was found and deleted
    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Send a success message if deletion was successful
    res.status(200).json({
      message: "Company successfully deleted",
    });
  } catch (error) {
    // Log any error that occurs during deletion
    console.error("Error deleting company from database: ", error);

    // Send a 500 status code with an error message in case of failure
    res
      .status(500)
      .json({ error: "An error occurred while deleting the company data" });
  }
};

module.exports = { deleteCompanyById };
