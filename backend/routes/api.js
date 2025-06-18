const express = require("express");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const cors = require("cors");

const router = express.Router();
const GetAllForms = require("../controller/getAllForms.js");
const AddForm = require("../controller/addForm.js");
const UpdateForm = require("../controller/updateForm.js");
const DeleteClient = require("../controller/deleteForm.js");
const onlySearchByCompanyName = require("../controller/onlySearchByCompanyName.js");
const searchCompany = require("../controller/searchCompany.js");
const sendEMail = require("../controller/Email/sendEmail.js");
const searchByAny = require("../controller/searchByAny.js");
const Login = require("../controller/Login/loginController.js");
const Registration = require("../controller/Login/registerController.js");
const GetUsersController = require("../controller/Login/getUsersController.js");
const UpdateRole = require("../controller/Login/updateRoleController.js");
const DeleteUser = require("../controller/Login/deleteUserController.js");
const ResetPassword = require("../controller/Login/resetPasswordController.js");
const RequestPasswordReset = require("../controller/Login/PasswordResetRequestController.js");
const { body, validationResult } = require("express-validator");
const searchCompanybyID = require("../controller/searchCompany.js");
const roleMiddleware = require("../middleware/roleMiddleware"); // Import the role middleware

const GetUpdateInfo = require("../controller/getUpdateInfo.js");

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://192.168.1.78:3000"], // For local development
  // Replace with your actual front-end origin
  credentials: true, // Allow credentials
};

// Use CORS middleware
router.use(cors(corsOptions));

// User registration
router.post("/register", Registration.Registration);

// User login
router.post("/login", Login.Login);

router.get("/get-users", GetUsersController.GetUsers);

router.post("/update-role", UpdateRole.UpdateRoleController);

router.delete("/delete-user", DeleteUser.DeleteUserController);

router.post(
  "/request-password-reset",
  RequestPasswordReset.PasswordResetRequestController
);

router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("token").notEmpty().withMessage("Token is required"),
  ],
  ResetPassword.ResetPasswordController
);

//to get all forms
router.get("/getallforms", GetAllForms.getAllForms);

//get company by company number
router.get("/getbyNumber/:companyNumber", GetAllForms.getByCompanyNumber);

// Admin-only route
router.post("/add-client", roleMiddleware([1]), (req, res) => {
  // Logic for adding a client
  res.send("Client added!");
});

// Data Entry Operator and Admin can access this route
router.get("/view-clients", roleMiddleware([1, 2]), (req, res) => {
  // Logic for viewing clients
  res.send("Clients viewed!");
});

// To add new form
router.post(
  "/addform",
  roleMiddleware(["Admin", "Data Entry Operator"]),
  AddForm.createForm
); // Restricted access

router.delete("/deleteClient", DeleteClient.deleteCompanyById);

// To update form
router.post(
  "/updateform",
  roleMiddleware(["Admin", "Data Entry Operator"]),
  UpdateForm.updateFormByCompanyNumber
); // Restricted access

// router.post("/updateform", UpdateForm.updateFormByCompanyNumber);

// Example routes with role-based access

router.post("/admin-route", roleMiddleware(["Admin"]), (req, res) => {
  // Only accessible by Admin
  res.send("This is an admin route.");
});

router.get(
  "/Data Entry Operator-route",
  roleMiddleware(["Admin", "Data Entry Operator"]),
  (req, res) => {
    // Accessible by Admin and Data Entry Operator
    res.send("This is a Data Entry Operator route.");
  }
);

router.get(
  "/viewer-route",
  roleMiddleware(["Admin", "Data Entry Operator", "Viewer"]),
  (req, res) => {
    // Accessible by Admin, Data Entry Operator, and Viewer
    res.send("This is a viewer route.");
  }
);

//sending company name object to frontend
router.get("/onlyCompany", onlySearchByCompanyName.getAllCompanyNames);

//to search companny in search field for frontend
router.get("/search", searchCompany.searchCompany);

router.get("/getCompanyById", searchCompanybyID.getCompanyById);

//by any field
router.get("/anyfield", searchByAny.searchByAnyField);

//send email to client
router.post("/send-mail", sendEMail.sendEmailToClient);

router.get("/byContact", searchCompany.searchContacts);

router.get("/get-UpdateInfo", GetUpdateInfo.getUpdateInfoWithCompanyName);

module.exports = router;
