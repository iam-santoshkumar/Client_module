const express = require("express");
const router = express.Router();
const GetAllForms = require("../controller/getAllForms.js");
const AddForm = require("../controller/addForm.js");
const UpdateForm = require("../controller/updateForm.js");
const onlySearchByCompanyName = require("../controller/onlySearchByCompanyName.js");
const searchCompany = require("../controller/searchCompany.js");
const sendEMail = require("../controller/Email/sendEmail.js");
const searchByAny = require("../controller/searchByAny.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const User = require("../models/user"); // Import the User model

// Register endpoint
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
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
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    res
      .status(200)
      .json({ success: true, token, message: "Login successful!" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Error logging in." });
  }
});

// Save Protocol endpoint
router.post("/saveProtocol", async (req, res) => {
  const protocolData = req.body;

  try {
    console.log("Protocol Data:", protocolData);
    res
      .status(201)
      .json({ success: true, message: "Protocol saved successfully!" });
  } catch (error) {
    console.error("Error saving protocol:", error);
    res.status(500).json({ success: false, message: "Error saving protocol." });
  }
});

// Existing routes...
router.get("/getallforms", GetAllForms.getAllForms);
router.get("/getbyNumber/:companyNumber", GetAllForms.getByCompanyNumber);
router.post("/addform", AddForm.createForm);
router.post("/updateform", UpdateForm.updateFormByCompanyNumber);
router.get("/onlycompany", onlySearchByCompanyName.getAllCompanyNames);
router.get("/search", searchCompany.searchCompany);
router.get("/anyfield", searchByAny.searchByAnyField);
router.post("/send-mail", sendEMail.sendEmailToClient);

module.exports = router;
