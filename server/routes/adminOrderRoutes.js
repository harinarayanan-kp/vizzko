const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");

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

// GET /api/admin/orders - View all orders, with optional search/filter
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const {
      user,
      paymentStatus,
      deliveryStatus,
      limit = 50,
      skip = 0,
    } = req.query;
    const query = {};
    if (user) {
      // user can be userId or email
      const userDoc = await User.findOne({
        $or: [{ _id: user }, { email: user }],
      });
      if (userDoc) query.user = userDoc._id;
      else return res.json({ orders: [], total: 0 });
    }
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (deliveryStatus) query.deliveryStatus = deliveryStatus;
    const orders = await Order.find(query)
      .populate("user", "_id name email")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });
    const total = await Order.countDocuments(query);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders/:id - View full order details
router.get("/orders/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "_id name email"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/orders/:id - Update order paymentStatus or deliveryStatus
router.patch("/orders/:id", adminAuth, async (req, res) => {
  try {
    const { paymentStatus, deliveryStatus } = req.body;
    const update = {};
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (deliveryStatus) update.deliveryStatus = deliveryStatus;
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).populate("user", "_id name email");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
