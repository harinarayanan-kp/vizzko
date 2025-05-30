const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Middleware to check authentication (replace with your auth middleware)
const auth = (req, res, next) => {
  // Example: req.userId is set by your auth middleware
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // ...verify token and set req.userId...
  // For demo, assume userId is in req.headers['x-user-id']
  req.userId = req.headers['x-user-id'];
  next();
};

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, design, quantity, size, color } = req.body;
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }
    // Check if item already exists (by productId and design)
    const existingItem = cart.items.find(
      item => item.productId === productId && item.design === design && item.size === size && item.color === color
    );
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ productId, design, quantity, size, color });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;