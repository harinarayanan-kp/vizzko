const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  modelUrl: { type: String, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
