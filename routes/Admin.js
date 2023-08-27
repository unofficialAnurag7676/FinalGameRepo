

const express = require("express");
const passport = require("passport");
const router = express.Router();

const {Adminlogin,userUpdateByAdmin,userDeletionByAdmin}=require("../controler/admin");
const {auth,isAdmin}=require("../middlewire/authentication")
const {verifyOtp}=require("../controler/auth");
const {getSingleUserdata}=require("../controler/users");
const{getAlluser}=require("../controler/admin")

//admin login
router.post("/login",Adminlogin);

//verify otp
router.post("/verify/otp",verifyOtp);

//get all user
router.get("/getallusers",auth,isAdmin,getAlluser);

//user upadation by Admin
router.put("/update/:id",auth,isAdmin,userUpdateByAdmin);

//user deletion by user
router.delete("/delete/:id",auth,isAdmin,userDeletionByAdmin);

module.exports=router;