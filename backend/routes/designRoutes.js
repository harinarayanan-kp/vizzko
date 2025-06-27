const express = require("express");
const router = express.Router();
const Design = require("../models/Design");
const jwt = require("jsonwebtoken");

// Middleware to check authentication and set req.userId from JWT
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Add a new design
router.post("/add", auth, async (req, res) => {
  try {
    const {
      designId,
      frontImageUrl,
      backImageUrl,
      shoulderImageUrl,
      baseColor,
      prompt,
    } = req.body;
    const design = new Design({
      designId,
      frontImageUrl,
      backImageUrl,
      shoulderImageUrl,
      baseColor,
      prompt,
      user: req.userId,
    });
    await design.save();
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all designs for a user
router.get("/", auth, async (req, res) => {
  try {
    const designs = await Design.find({ user: req.userId });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
