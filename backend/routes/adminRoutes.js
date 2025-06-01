const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order"); // Adjust path as needed

// Replace with your admin credentials or use a database
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Admin login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // You can use JWT or session here
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

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
    return res.status(401).json({ error: "Unauthorized" });
  }
}
// Get all orders
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate("user"); // Adjust as needed
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;