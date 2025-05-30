const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  design: { type: String }, // e.g., design image or prompt
  quantity: { type: Number, default: 1 },
  size: { type: String }, // e.g., S, M, L, XL
  color: { type: String }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);