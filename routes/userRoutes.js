const express=require("express");
const router=express.Router();

//import the require controler and middleware

const{sendOTP,login,signup}=require("../controler/auth")
const {getAlluser,getSingleUserdata}=require("../controler/users");


// ********************************************************************************************************
//                                     Authentication routes
// ********************************************************************************************************
router.post("/send/otp",sendOTP);
router.post("/signup",signup);
router.post("/login",login);
router.post("/get/user/data",getSingleUserdata)
router.get("/get-all/users",getAlluser);


module.exports=router;