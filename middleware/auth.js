const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token not provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded; // { user_id, role }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { checkAuth, adminOnly };
console.log("✅ Middleware is working");
