const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.js");

const Registration = async (req, res) => {
    console.log("Body:", req.body);
    const { username, email, password, role } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
  
      res
        .status(201)
        .json({ success: true, message: "User registered successfully!" });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ success: false, message: "Error registering user." });
    }
};

module.exports = {Registration};