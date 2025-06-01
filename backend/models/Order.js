const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: String,
      quantity: Number,
      // ...other fields
    }
  ],
  total: Number,
  status: { type: String, default: "Pending" }
});
module.exports = mongoose.model("Order", OrderSchema);