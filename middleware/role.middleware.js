const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied: ${req.user.role} cannot access this route` });
    }

    next();
  };
};

module.exports = { checkRole };
console.log("✅ Role middleware loaded");