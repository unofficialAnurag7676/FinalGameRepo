const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    trim: true,
  },
  // Define the role field with type String and enum values of "Admin", "Gammer"
  accountType: {
    type: String,
    default: "Gammer",
  },

  active: {
    type: Boolean,
    default: true,
  },

  phone: {
    type: Number,
    default: true,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },

  //token for reset password
  token: {
    type: String,
  },

  totalWinCoin: {
    type: Number,
    default: 0,
    required: true,
  },
  currentCoin: {
    type: Number,
    default: 0,
    required: true,
  },
  totalCash: {
    type: Number,
    default: 0,
    required: true,
  },
  resetPassExpires: {
    type: Date,
  },
  image: {
    type: String,
  },
  withdrwalLimit: {
    type: Number,
    default: 0,
  },
  paymentAddress: {
    tyep: String,
  },
  totalPaymetRecived: {
    type: Number,
    default: 0,
    required: true,
  },
  paymentHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
