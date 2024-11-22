const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalCartPrice: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", async function (next) {
  if (this.isModified("cartItems") || this.isNew) {
    let totalItemsPrice = 0;

    for (const item of this.cartItems) {
      const product = await mongoose.model("Product").findById(item.product);
      if (product) {
        totalItemsPrice += product.price * item.quantity;
      }
    }

    this.totalCartPrice = totalItemsPrice;
  }
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
