const Company = require("../models/company");
const UpdateInfo = require("../models/UpdateInfo");

const getUpdateInfoWithCompanyName = async (req, res) => {
  try {
    const data = await UpdateInfo.findAll({
      include: [
        {
          model: Company,
          as: "company", // Match the alias defined in associations
          attributes: ["nameOfCompany"], // Only fetch the nameOfCompany attribute
        },
      ],
    });

    return res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return res.status(500).json({ error: "An error occurred while fetching data." });
  }
};


module.exports = { getUpdateInfoWithCompanyName };
