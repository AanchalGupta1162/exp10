const User = require('../models/User');

const authenticateUser = (req, res, next) => {
  console.log("AUTH CHECK - Session ID:", req.sessionID);
  
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user data to the request object
    console.log("Authenticated user in middleware:", req.user.username);
    return next();
  }
  
  console.log("Not authenticated in authenticateUser middleware");
  res.status(401).json({ message: 'Not authorized, please log in' });
};

const protect = (req, res, next) => {
  console.log("PROTECT MIDDLEWARE - Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user data to the request object
    console.log("Authenticated user:", req.user);
    return next();
  }
  
  console.log("Not authenticated - session exists:", !!req.session);
  console.log("Cookie headers:", req.headers.cookie);
  res.status(401).json({ message: 'Not authorized, please log in' });
};

module.exports = {
  authenticateUser,
  protect
};
