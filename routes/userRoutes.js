const express=require("express");
const router=express.Router();

//import the require controler and middleware
const {auth,isGammer,isAdmin}=require("../middlewire/authentication")

const{login,signup,sendOTP,mobileOtpSender}=require("../controler/auth")
const {getSingleUserdata}=require("../controler/users");


// ********************************************************************************************************
//                                     Authentication routes
// ********************************************************************************************************
router.post("/send/otp",sendOTP); //for admin otp 
router.post("/signup",signup);
router.post("/login",login);
router.get("/getuser/:id",auth,getSingleUserdata);
router.post('/user/send/otp',mobileOtpSender)



module.exports=router;