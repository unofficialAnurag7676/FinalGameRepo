const express=require("express");
const router=express.Router();
const {auth,isGammer}=require("../middlewire/authentication")

const {withdrawalReq}=require('../controler/users');

//for withdrawl request

router.post('/withdrawl',auth,withdrawalReq);

module.exports=router;