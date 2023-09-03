const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
   paymentStatus: {
     type: String,
     default: "Processing" // complete // rejected
   },
   createdAt: {
     type: Date,
     default: Date.now
   },
   userName:{
    type:String,
    required:true,
   },
   paymentAddress:{
    type:String,
    required:true
   },
   ammount:{
    type:Number,
    required:true
   },
   userID: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
   }
});

// Set the expiration time for documents to 30 days (in seconds)
paymentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Define a middleware to remove references from user paymentHistory when a payment document is deleted
paymentSchema.post('remove', async function (doc) {
    const userId = doc.user;
    if (userId) {
        // Find the user document and pull the deleted payment's ID from paymentHistory
        await mongoose.model('User').findByIdAndUpdate(userId, {
            $pull: { paymentHistory: doc._id }
        });
    }
});

module.exports = mongoose.model("Payment", paymentSchema);

