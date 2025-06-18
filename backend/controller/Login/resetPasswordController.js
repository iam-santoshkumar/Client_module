const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const ResetPasswordController = async (req, res) => {
  const { email, newPassword, token } = req.body;
  // console.log("Request Body:", req.body);
  // Validate the incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find user by email and token
    const user = await User.findOne({
      where: { email, resetPasswordToken: token },
    });

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null; // Clear the token
    user.resetPasswordExpires = null; // Clear the expiry
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { ResetPasswordController };
