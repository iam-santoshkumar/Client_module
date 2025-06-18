const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or any other service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password
  },
});

const sendResetEmail = async (email, token) => {
  // Update the reset URL to correctly include the email and token
  const resetUrl = `http://192.168.34.50:3000/password-reset/${encodeURIComponent(
    email
  )}/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendResetEmail };
