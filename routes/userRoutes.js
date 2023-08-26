const express=require("express");
const router=express.Router();

//import the require controler and middleware
const {auth,isGammer,isAdmin}=require("../middlewire/authentication")

const{mobileOtpSender,login,signup}=require("../controler/auth")
const {getAlluser,getSingleUserdata}=require("../controler/users");


// ********************************************************************************************************
//                                     Authentication routes
// ********************************************************************************************************
router.post("/send/otp",mobileOtpSender);
router.post("/signup",signup);
router.post("/login",login);
router.post("/get/user/data",auth,getSingleUserdata)
router.get("/getallusers",auth,isAdmin,getAlluser);


module.exports=router;