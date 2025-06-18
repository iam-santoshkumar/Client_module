const User = require("../../models/user.js")

const GetUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["email", "role"],
      });
  
      if (users.length > 0) {
        res.status(200).json({ message: "User List Found", data: users });
        console.log("Users and Roles: ", JSON.stringify(users));
      } else {
        res.status(404).json({ message: "No users found" });
      }
    } catch (error) {
      console.error("Error while fetching user data from database: ", error);
      res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

module.exports = {GetUsers};