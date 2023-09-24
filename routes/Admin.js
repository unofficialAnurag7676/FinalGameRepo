

const express = require("express");
const passport = require("passport");
const router = express.Router();
const Admin=require('../model/admin');

const {Adminlogin,
    userUpdateByAdmin,
    userDeletionByAdmin,
    getAllPaymentReq,
    updateWithdrawlReq
}=require("../controler/admin");
const {auth,isAdmin}=require("../middlewire/authentication")
const {verifyOtp}=require("../controler/admin");
const {getSingleUserdata}=require("../controler/users");
const{getAlluser}=require("../controler/admin")
const {sendOTP}=require('../controler/admin')

//send email otp
router.post('/send/otp',sendOTP);

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


//get all payment request
router.get('/withdrawl/list',auth,isAdmin,getAllPaymentReq);


//upadte paymnet withdrawl request
router.put('/withdrawl/update',auth,isAdmin,updateWithdrawlReq);


module.exports=router;