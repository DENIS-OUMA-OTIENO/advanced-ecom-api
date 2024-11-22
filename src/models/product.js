const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide the product number"],
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please provide the product price"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
