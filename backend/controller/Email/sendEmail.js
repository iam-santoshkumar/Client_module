// Importing the 'text' middleware from the 'body-parser' library for parsing incoming text request bodies
const { text } = require("body-parser");

// Importing the 'nodemailer' library, which allows sending emails from Node.js applications
const nodemailer = require("nodemailer");

// Creating a reusable transporter object using the default SMTP transport with Gmail service
// This will handle the email configuration (email address and password) using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail service is used to send emails
  auth: {
    user: process.env.EMAIL_USER, // Email address is fetched from environment variables from .env file
    pass: process.env.EMAIL_PASS, // Email password is fetched from environment variables from .env file
  },
});

// Asynchronous function to send an email to a client
// The 'req' object contains the email details (to, cc, subject, body), and 'res' is used to send back a response
const sendEmailToClient = async (req, res) => {
  try {
    const { to, cc, subject, body } = req.body;
    console.log("Email details:", { to, cc, subject, body }); // Log incoming email details

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      cc,
      subject,
      text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error); // Log error details
        return res.status(500).json({ error: error.message || "Error sending email" }); // Send the error message back to the client
      }
      console.log("Email sent:", info.response);
      return res.status(200).json({ message: "Email sent successfully!" });
    });
    
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Exporting the 'sendEmailToClient' function so it can be used in other modules of the application
module.exports = {
  sendEmailToClient,
};
