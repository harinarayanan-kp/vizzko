//authRoutes.js
const express = require("express");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * User Signup
 * - Expects: { name, email, password }
 * - Validates input and checks for existing user.
 * - Creates a new user and returns a JWT token and user info.
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ error: "Name, email, and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already exists" });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res
      .status(201)
      .send({
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).send({ error: error.message });
  }
});

/**
 * User Login
 * - Expects: { email, password }
 * - Validates input and checks credentials.
 * - Returns a JWT token if authentication is successful.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.send({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ error: error.message });
  }
});

/**
 * Password Reset
 * - Expects: { email, newPassword }
 * - Finds user by email and updates the password.
 */
router.post("/password-reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .send({ error: "Email and new password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    user.password = newPassword;
    await user.save();
    res.send({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).send({ error: "Failed to reset password" });
  }
});

module.exports = router;