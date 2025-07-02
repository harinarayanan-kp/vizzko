const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const router = express.Router();

// Middleware to authenticate and attach userId to req
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// GET /api/user - Get current user's profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
