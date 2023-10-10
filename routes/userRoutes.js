const express = require("express");
const router = express.Router();

//import the require controler and middleware
const { auth, isGammer, isAdmin } = require("../middlewire/authentication");

const {
  login,
  signup,
  sendOTP,
  mobileOtpSender,
  verifyOtp,
  mobileOtpVerify,
  forgotPassword,
} = require("../controler/auth");
const { getSingleUserdata } = require("../controler/users");
const { buyCoins, paymetnSuccess } = require("../controler/BuyCoins");
const { decreaseCoin } = require("../controler/gameCoin");

// ********************************************************************************************************
//                                     Authentication routes
// ********************************************************************************************************
router.post("/signup", signup);
router.post("/login", login);
router.get("/getuser/:id", auth, getSingleUserdata);
router.post("/user/send/otp", mobileOtpSender);
router.post("/user/verify/phone", mobileOtpVerify);
router.post("/send/email/otp", sendOTP);
router.post("/verify/email", verifyOtp);
router.post("/buy-coins", auth, buyCoins);
router.post("/forgot-password", forgotPassword);
router.post("/coin/decrease", auth, decreaseCoin);

module.exports = router;
