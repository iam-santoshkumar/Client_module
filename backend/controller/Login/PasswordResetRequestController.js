// controllers/PasswordResetRequestController.js
const User = require("../../models/user");
const crypto = require("crypto");
const { sendResetEmail } = require("../../controller/Email/mailer.js");

const PasswordResetRequestController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetEmail(email, token);

    return res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { PasswordResetRequestController };
