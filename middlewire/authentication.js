const User=require("../model/user");
require("dotenv").config();
const jwt=require("jsonwebtoken");

//auth
exports.auth=async(req,res,next)=>{
    try {
       
       const token = req.cookies.token 
       || req.body.token 
       || req.header("Authorization").replace("Bearer ", "");
   
   
   
       if(!token)
       {
           return res.status(400).json({
               success:false,
               message:"token not found",
               
           })
       }
       try {
           // jwt.verify() return payload
           const decode= jwt.verify(token, process.env.JWT_SECRET);
   
           // insert the payload in requset 
            req.user=decode;
       } catch (error) {
           return res.status(403).json({
               success:false,
               message:"token is invalid"
           })
       }
       next();
    } catch (error) {
       return res.status(405).json({
           success:false,
           message:"token verification failed",
           data:error.message
       })
    }
     
}

//confirm gammer account
exports.isGammer=async(req,res,next)=>{

    try {
        if(req.user.role !=="Gammer")
        {
            return res.status(500).json({
                success:false,
                message:"You are not a astudent bro"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error in student route",
            data: console.log(error)
        })
    }
}

//confirm Admin account
exports.isAdmin=async(req,res,next)=>{
    
    try {
        if(req.user.role !=="Admin")
        {
            return res.status(500).json({
                success:false,
                message:"You are not a admin bro"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error in admin route",
            data: console.log(error)
        })
    }
}