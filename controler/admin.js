const User = require("../model/admin");
const Payment = require("../model/payment");
const Gamer = require("../model/user");
const Profile = require("../model/profile");
const Admin = require("../model/admin");
const otpGenerator = require("otp-generator");
const EmailOTP = require("../model/emailOtp");
const mailsender = require("../mail/mailSender");
const jwt = require("jsonwebtoken");

//send email otp
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userExsist = await Admin.findOne({ email });

    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //check the unique otp or not
    let result = await EmailOTP.findOne({ otp: otp });

    while (result) {
      otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await EmailOTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await EmailOTP.create(otpPayload);

    await mailsender(email, "OTP verification", otp);

    res.status(200).json({
      success: true,
      message: "Otp sent sucessfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify
exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const recentOTP =
      (await EmailOTP.findOne({ email: email })
        .sort({ createdAt: -1 })
        .limit(1)) || [];

    let user = await User.findOne({ email });
    if (recentOTP.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOTP.otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid otp",
      });
    } else {
      // create JWT tokens
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };

      //payload , secretkey ,options
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        maxAge: 10 * 24 * 60 * 60 * 1000, // Expires after 3 days
        httpOnly: true,
      };
      return res
        .cookie("token", token, options)
        .status(200)
        .json({
          success: true,
          token,
          user,
          message: `Logedin successfully and token id ${token}`,
        });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};
//log in
exports.Adminlogin = async (req, res) => {
  try {
    // fetch the data from req body
    const { email, password } = req.body;

    //valid data or not
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All filed are require",
      });
    }

    // check user exist or not
    //need to populate game-coin also **REMAINING
    let user = await User.findOne({ email }).populate("additonalDetails");
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User not exsist",
      });
    }

    //compare password
    if (user.password === password) {
      // create JWT tokens
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };

      //payload , secretkey ,options
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        maxAge: 10 * 24 * 60 * 60 * 1000, // Expires after 3 days
        httpOnly: true,
      };
      return res
        .cookie("token", token, options)
        .status(200)
        .json({
          success: true,
          token,
          user,
          message: `Logedin successfully and token id ${token}`,
        });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password incorect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login fail eroor in network call",
      data: error.message,
    });
  }
};

//get all user
exports.getAlluser = async (req, res) => {
  const page = parseInt(req.query.page) || 2; // Get the page number from query parameters or default to 1
  const size = parseInt(req.query.size) || 2; // Get the page size from query parameters or default to 10

  try {
    const totalUsers = await Gamer.countDocuments({});

    const skip = (page - 1) * size;
    const users = await Gamer.find({}).skip(skip).limit(size);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalRecords: totalUsers,
        totalPages: Math.ceil(totalUsers / size),
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

//uesr updation by admin
exports.userUpdateByAdmin = async (req, res) => {
  try {
    const { phone, firstName, lastName, email, gameMoney } = req.body;
    const userID = req.params.id;

    // Check if any required field is missing
    if (!phone || !firstName || !lastName || !email || !gameMoney || !userID) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find the user by their unique identifier (e.g., email)
    const user = await Gamer.findById({ _id: userID });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's data with the new values
    user.phone = phone;
    user.firstName = firstName;
    user.lastName = lastName;
    user.gameMoney = gameMoney;
    user.email = email;
    user.accountType = user.accountType || "Gammer";

    // Save the updated user object
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User data updated successfully",
      data: user, // Optionally, you can send the updated user data in the response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//user deletion by admin
exports.userDeletionByAdmin = async (req, res) => {
  try {
    const userID = req.params.id;

    const response = await Gamer.findByIdAndDelete({ _id: userID });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: "Intenal server error",
      fault: error.message,
    });
  }
};

//get all paymnet request
exports.getAllPaymentReq = async (req, res) => {
  try {
    const allReq = await Payment.find({});

    return res.status(200).json({
      succes: true,
      data: allReq,
    });
  } catch (error) {
    return res.stats(500).json({
      succes: false,
      message: "Internal server error",
      fault: error.message,
    });
  }
};

//updated payment
exports.updateWithdrawlReq = async (req, res) => {
  try {
    const { paymentID, status } = req.body;

    if (!paymentID || !status) {
      return res.status(404).json({
        succes: false,
        message: "all field are required",
      });
    }

    //   const user=await User.findById({_id:payment.userID});

    if (status === "Completed") {
      //deduct coin from user
      //mark payment status completed
      const payment = await Payment.findByIdAndUpdate(
        { _id: paymentID },
        { paymentStatus: status }
      );

      return res.status(200).json({
        succes: true,
      });
    } else {
      const payment = await Payment.findByIdAndUpdate(
        { _id: paymentID },
        { paymentStatus: status }
      );

      return res.status(200).json({
        succes: true,
        message: "req rejected",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
