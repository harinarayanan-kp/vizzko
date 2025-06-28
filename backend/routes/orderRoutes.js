const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

// User auth middleware
function userAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// User: View their own orders
router.get("/", userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User: Place a new order
router.post("/", userAuth, async (req, res) => {
  try {
    const {
      items,
      total,
      name,
      address,
      billing,
      paymentStatus,
      deliveryStatus,
    } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }
    // Validate each item has price
    for (const item of items) {
      if (typeof item.price !== "number") {
        return res.status(400).json({ error: "Each item must have a price" });
      }
    }
    const order = new Order({
      user: req.userId,
      items,
      total: total || 0,
      paymentStatus: paymentStatus || "Pending",
      deliveryStatus: deliveryStatus || "Processing",
      name,
      address,
      billing,
    });
    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
