const express = require("express");
const { body, validationResult } = require("express-validator");
const { signup, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Validation rules
const validateSignup = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validation error handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ errors: errors.array().map((e) => e.msg) });
  next();
};

// Public routes
router.post("/signup", validateSignup, handleValidation, signup); // Validate inputs before controller runs [web:227]
router.post("/login", validateLogin, handleValidation, login); // Enforces presence/format for email/password [web:227]

// Private route: restore current user from JWT
router.get("/me", protect, me); // Uses protect middleware to verify Bearer token and return req.user [web:226]

module.exports = router;
