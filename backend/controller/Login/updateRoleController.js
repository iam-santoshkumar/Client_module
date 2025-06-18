const User = require("../../models/user.js")

const UpdateRoleController = async (req, res) => {
    const { email, role } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }
  
      if (role) {
        user.role = role;
      } else {
        return res.status(400).json({
          error: "Role is required to update.",
        });
      }
  
      await user.save();
  
      res.status(200).json({
        message: `Role updated successfully for ${user.username}`,
      });
    } catch (error) {
      console.error("Error while updating role: ", error);
      res.status(500).json({
        error: "An error occurred while updating the role",
      });
    }
};

module.exports = {UpdateRoleController};