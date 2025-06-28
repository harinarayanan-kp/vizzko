const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Design = require("../models/Design");
const Order = require("../models/Order");

// Middleware to check admin (simple JWT check)
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.admin) return next();
    return res.status(403).json({ error: "Forbidden" });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// GET /api/admin/users/count
router.get("/users/count", adminAuth, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/designs/count
router.get("/designs/count", adminAuth, async (req, res) => {
  try {
    const count = await Design.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/generatedImages/count
router.get("/generatedImages/count", adminAuth, async (req, res) => {
  try {
    // Sum all generatedImages arrays' lengths for all users
    const users = await User.find({}, "generatedImages");
    const count = users.reduce(
      (acc, user) => acc + (user.generatedImages?.length || 0),
      0
    );
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders/stats
router.get("/orders/stats", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find();
    const count = orders.length;
    const revenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    res.json({ count, revenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
