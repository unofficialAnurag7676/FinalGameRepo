const express=require("express");
const router=express.Router();

//import the require controler and middleware
const {auth,isGammer,isAdmin}=require("../middlewire/authentication")

const{login,signup,sendOTP}=require("../controler/auth")
const {getSingleUserdata}=require("../controler/users");


// ********************************************************************************************************
//                                     Authentication routes
// ********************************************************************************************************
router.post("/send/otp",sendOTP);
router.post("/signup",signup);
router.post("/login",login);
router.get("/getuser/:id",auth,getSingleUserdata);



module.exports=router;