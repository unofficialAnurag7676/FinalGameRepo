const mongoose = require("mongoose");
const emailotpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 20,
  },
});
module.exports = mongoose.model("emailOTP", emailotpSchema);
