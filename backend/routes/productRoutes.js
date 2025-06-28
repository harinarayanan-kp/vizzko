const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products/:id - Get product details by product name
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/price/:id/:size - Get price for a product and size
router.get("/price/:id/:size", async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    const sizeObj = product.sizes.find((s) => s.size === req.params.size);
    if (!sizeObj) return res.status(404).json({ error: "Size not found" });
    res.json({ price: sizeObj.price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/id-from-name/:name - Get product _id from its name
router.get("/id-from-name/:name", async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.name });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ id: product._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
