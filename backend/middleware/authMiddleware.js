const User = require('../models/User');

const authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user data to the request object
    return next();
  }
  res.status(401).json({ message: 'Not authorized, please log in' });
};

const protect = (req, res, next) => {
  console.log("Session data:", req.session);
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user data to the request object
    console.log("Authenticated user:", req.user);
    return next();
  }
  console.log("Not authenticated");
  res.status(401).json({ message: 'Not authorized, please log in' });
};

module.exports = {
  authenticateUser,
  protect
};
