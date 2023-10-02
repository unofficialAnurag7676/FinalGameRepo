const mongoose = require("mongoose");

const buyCoinSchema = new mongoose.Schema({
  sessionID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 86400, // Expires in 1 day (86400 seconds)
  },
});

module.exports = mongoose.model("BuyCoin", buyCoinSchema);
