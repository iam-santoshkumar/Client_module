const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Adjust as necessary

const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.user_id); // Fetch user from DB

      if (!user || !allowedRoles.includes(user.role)) {
        // Check against role string
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user; // Attach user to request
      next(); // Continue to the next middleware/route
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = roleMiddleware;
