require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const OTP = require("../model/otp");
const EmailOTP = require("../model/emailOtp");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

const mailsender = require("../mail/mailSender");
const emailOtp = require("../model/emailOtp");
const Admin = require("../model/admin");

require("dotenv").config();

// send OTP via email for admin verification
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userExsist = await User.findOne({ email });

    if (userExsist) {
      return res.status(400).json({
        message: "Email already exist",
      });
    }

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

//verify otp/sign in for api for Admin
exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const recentOTP = await emailOtp
      .findOne({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);

    let user = await Admin.findOne({ email });
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
    }

    return res.status(200).json({
      success: true,
      message: "Email verified",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

// sign in api for Gammer
exports.signup = async (req, res) => {
  try {
    const { FullName, contactNumber, password, otp } = req.body;
    const recentOTP = await OTP.findOne({ phone: contactNumber })
      .sort({ createdAt: -1 })
      .limit(1);
    if (recentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "otp invalid",
      });
    }
    // verify otp , cause user only done sign up when email verififcation done before create a new entry in DB
    if (!FullName || !contactNumber || !password) {
      return res.status(403).json({
        success: false,
        message: "all field are require",
      });
    }

    // check user already present
    if (await User.findOne({ phone: contactNumber })) {
      return res.status(400).json({
        success: false,
        message: "user already exsist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    //finaly create user in Data Base
    const user = await User.create({
      FullName,
      phone: contactNumber,
      gameMoney: 0,
      password: hashPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${FullName} ${FullName}`,
    });

    //create token for token
    const payload = {
      phone: user.phone,
      id: user._id,
      role: user.accountType,
    };

    //payload , secretkey ,options
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });
    user.token = token;

    //create cookie
    const options = {
      maxAge: 10 * 24 * 60 * 60 * 1000, // Expires after 3 days
      httpOnly: true,
    };
    user.password = undefined;
    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error in creating user",
      data: error.message,
    });
  }
};

// login api
exports.login = async (req, res) => {
  try {
    // fetch the data from req body
    const { phoneNumber, password } = req.body;
    //valid data or not
    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All filed are require",
      });
    }
    // check user exist or not
    //need to populate game-coin also **REMAINING
    let user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User not exsist",
      });
    }

    //compare password
    if (await bcrypt.compare(password, user.password)) {
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
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
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

// mobile otp snding for gammer
exports.mobileOtpSender = async (req, res) => {
  try {
    const { phoneNumber, countryCode } = req.body;

    //   const accountSid = 'AC73d4357bd025c361d5af9b1adc462de8';
    //   const authToken = '583cc20ceb043ea121b1969019e5072f';
    const client = require("twilio")(
      process.env.accountSid,
      process.env.authToken
    );

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    client.messages
      .create({
        body: `Your otp for suits card game is ${otp}`,
        from: "+18447391301",
        to: `+${countryCode}${phoneNumber}`,
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.error("Error sending message:", error));

    const Payload = { phone: phoneNumber, otp };
    await OTP.create(Payload);

    return res.status(200).json({
      success: true,
      message: "otp send successfully",
    });
  } catch (error) {
    console.error(error.message);
    console.log("error in sending otp");
    return res.status(400).json({
      success: false,
      message: "Failed to send OTP",
      fault: error.message,
    });
  }
};

//mobile verify
exports.mobileOtpVerify = async (req, res) => {
  try {
    const { otp, phoneNumber } = req.body;

    const recentOTP = await OTP.findOne({ phone: phoneNumber })
      .sort({ createdAt: -1 })
      .limit(1);

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
    }

    return res.status(200).json({
      success: true,
      message: "Phone number verified",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { newPassword, confirmPassword, phoneNumber, otp } = req.body;
  try {
    const recentOTP = await OTP.findOne({ phone: phoneNumber })
      .sort({ createdAt: -1 })
      .limit(1);
    if (recentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "otp invalid",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }
    if ((!newPassword, !confirmPassword, !phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "ALl fields are required",
      });
    }

    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    return res.status(400).json({
      success: true,
      message: "Password Updated succsfully",
    });
  } catch (error) {}
  return res.status(400).json({
    success: false,
    message: "something went wrong",
  });
};
