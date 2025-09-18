const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: sign JWT (expiry read from env)
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @desc    Signup new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize email and check existence
    const emailNorm = email.trim().toLowerCase();
    const exists = await User.findOne({ email: emailNorm });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create user (password hashed by Mongoose pre-save hook)
    const user = await User.create({ name, email: emailNorm, password });

    // Create JWT
    const token = createToken(user._id);

    // Respond with safe user data
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const emailNorm = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: emailNorm });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Issue JWT
    const token = createToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current user (session restore)
// @route   GET /api/auth/me
// @access  Private
exports.me = async (req, res) => {
  // req.user is set by protect middleware
  res.status(200).json({ user: req.user });
};
