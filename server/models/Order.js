const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  designId: { type: String },
  quantity: { type: Number, default: 1 },
  size: { type: String },
  color: { type: String },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  total: Number,
  paymentStatus: { type: String, default: "Pending" },
  deliveryStatus: { type: String, default: "Processing" },
  name: String,
  address: String,
  billing: String,
});
module.exports = mongoose.model("Order", OrderSchema);
