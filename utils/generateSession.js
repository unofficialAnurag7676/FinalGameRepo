const crypto = require("crypto");

function generateUniqueSessionId(contactNumber, userId) {
  // Concatenate the user's contact number, user ID, and a timestamp
  const dataToHash = `${contactNumber}${userId}${Date.now()}`;

  // Create a hash of the concatenated data (e.g., using SHA-256)
  const hash = crypto.createHash("sha256").update(dataToHash).digest("hex");

  // You can further customize the format of the session ID if needed
  const session_id = `SID_${hash}`;

  return session_id;
}

module.exports = generateUniqueSessionId;
