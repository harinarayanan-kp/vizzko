// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const jwt = require("jsonwebtoken");

// // Middleware to check admin (reuse from stats route in production)
// function adminAuth(req, res, next) {
//   const auth = req.headers.authorization;
//   if (!auth) return res.status(401).json({ error: "Unauthorized" });
//   try {
//     const token = auth.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.admin) return next();
//     return res.status(403).json({ error: "Forbidden" });
//   } catch {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }

// // GET /api/admin/products
// router.get("/products", adminAuth, async (req, res) => {
//   try {
//     const products = await Product.find();
//     // Map to use 'tshirt' key for frontend compatibility
//     const mapped = products.map((p) => ({
//       tshirt: p.name,
//       sizes: p.sizes,
//       modelUrl: p.modelUrl,
//     }));
//     res.json({ products: mapped });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PUT /api/admin/products/prices
// router.put("/products/prices", adminAuth, async (req, res) => {
//   try {
//     const { tshirt, size, price } = req.body;
//     const product = await Product.findOne({ name: tshirt });
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     let updated = false;
//     product.sizes = product.sizes.map((s) => {
//       if (s.size === size) {
//         updated = true;
//         return { size: s.size, price };
//       }
//       return s;
//     });
//     if (!updated) return res.status(404).json({ error: "Size not found" });
//     await product.save();
//     res.json({ success: true, product });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST /api/admin/products
// router.post("/products", adminAuth, async (req, res) => {
//   try {
//     const { tshirt, sizes, modelUrl } = req.body;
//     if (!tshirt || !Array.isArray(sizes) || !modelUrl) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//     // Check for duplicate product name
//     if (await Product.findOne({ name: tshirt })) {
//       return res.status(409).json({ error: "Product already exists" });
//     }
//     const product = new Product({ name: tshirt, sizes, modelUrl });
//     await product.save();
//     res.json({ success: true, product });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE /api/admin/products/:tshirt
// router.delete("/products/:tshirt", adminAuth, async (req, res) => {
//   try {
//     const { tshirt } = req.params;
//     const deleted = await Product.findOneAndDelete({ name: tshirt });
//     if (!deleted) return res.status(404).json({ error: "Product not found" });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PUT /api/admin/products/:tshirt
// router.put("/products/:tshirt", adminAuth, async (req, res) => {
//   try {
//     const { tshirt } = req.params;
//     const { newTshirt, sizes, modelUrl } = req.body;
//     const product = await Product.findOne({ name: tshirt });
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     product.name = newTshirt || product.name;
//     product.sizes = sizes || product.sizes;
//     product.modelUrl = modelUrl || product.modelUrl;
//     await product.save();
//     res.json({ success: true, product });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
