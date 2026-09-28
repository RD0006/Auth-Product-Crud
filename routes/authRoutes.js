const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const handleValidation = require("../middleware/validation");

const router = express.Router();

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match")
];

const loginValidation = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required")
];

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// POST /api/auth/register
router.post("/register", registerValidation, handleValidation, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", loginValidation, handleValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({
      message: "Login successful",
      accessToken
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/refresh-token
router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      user.refreshToken = null;
      await user.save();
      return res.status(401).json({ message: "Expired or invalid refresh token" });
    }

    const accessToken = createAccessToken(user);

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", cookieOptions);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;