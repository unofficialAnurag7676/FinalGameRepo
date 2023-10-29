const mongoose = require("mongoose");

// Define the Session Schema
const sessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  }, // Added phone_number field
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: '1w',
  },
});

// Create a Session model
const Session = mongoose.model("Session", sessionSchema);

// Export the Session model
module.exports = Session;
