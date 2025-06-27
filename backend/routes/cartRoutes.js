const express = require("express");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const router = express.Router();

// Middleware to check authentication and set req.userId from JWT
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // userId should be in your JWT payload
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Add item to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId, designId, quantity, size, color } = req.body; // designId instead of full image
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }
    // Check if item already exists (by productId, designId, size, color)
    const existingItem = cart.items.find(
      (item) =>
        item.productId === productId &&
        item.designId === designId &&
        item.size === size &&
        item.color === color
    );
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ productId, designId, quantity, size, color });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
router.post("/remove", auth, async (req, res) => {
  try {
    const { productId, designId, size, color } = req.body;
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.designId === designId &&
          item.size === size &&
          item.color === color
        )
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
