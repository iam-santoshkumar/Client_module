const User = require("../../models/user.js");

const DeleteUserController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await user.destroy();

    res.status(200).json({
      message: `User with email ${email} deleted successfully`,
    });
  } catch (error) {
    console.error("Error while deleting user: ", error);
    res.status(500).json({
      error: "An error occurred while deleting the user",
    });
  }
};

module.exports = { DeleteUserController };
