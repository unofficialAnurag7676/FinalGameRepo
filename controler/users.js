const User = require("../model/user");
const Payment = require("../model/payment");
const Admin = require("../model/admin");

exports.getSingleUserdata = async (req, res) => {
  try {
    const userID = req.params.id;

    const id = req.user.id;

    if (req.user.role !== "Admin" && id !== userID) {
      return res.status(500).json({
        success: false,
        message: "Something went wong",
      });
    }
    if (!userID) {
      return res.status(404).json({
        success: false,
        messahe: "user id not found",
      });
    }

    const userData = await User.findById(userID);

    return res.status(200).json({
      success: true,
      message: "Successfully get user data",
      data: userData,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

//after passing auth & isgammer middleware
//to user withdrwal req
exports.withdrawalReq = async (req, res) => {
  try {
    const { withdrawlAmount, userName, paymentAddress, userID } = req.body;

    if (!withdrawlAmount || !userName || !paymentAddress || !userID) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Create a new payment request document
    const paymentRequest = new Payment({
      paymentStatus: "Processing",
      userID,
      ammount: withdrawlAmount,
      userName,
      paymentAddress,
    });

    // Save the payment request to the Payment collection
    await paymentRequest.save();

    // Update the user's paymentHistory array with the generated payment request's _id
    const user = await User.findByIdAndUpdate(
      userID,
      {
        $push: { paymentHistory: paymentRequest._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment request created successfully",
      paymentRequest: paymentRequest, // You can send the payment request data in the response if needed
      user: user, // You can send the updated user data in the response if needed
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the payment request",
    });
  }
};
