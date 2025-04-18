const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Store user data in session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    // 🔄 Send only basic info back to frontend (no token)
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    console.log("Login successful:", email);


  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Check if user is authenticated via session
exports.checkAuth = (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({
      user: req.session.user
    });
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

// Logout user by destroying session
exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed', error: err.message });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    return res.status(200).json({ message: 'Nothing to logout' });
  }
};

// Simple ping endpoint to check if server is alive
exports.ping = (req, res) => {
  res.status(200).json({ status: 'ok' });
};
