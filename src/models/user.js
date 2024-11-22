const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  phone: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  status: {
    type: Boolean,
    default: true    
  },
  deliveryAddress: [{
    id: { type: mongoose.Schema.Types.ObjectId },
    alias: String,
    details: String,
    phone: String,
    city: String,
    street: String,
  }],
  paymentMethod: {
    type: String,
    enum: ["m-pesa", "card"],
    default: "m-pesa"
  }
},
  {timestamps: true}
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  user.password = await bcrypt.hash(user.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
