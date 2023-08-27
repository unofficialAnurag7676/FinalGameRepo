const User=require("../model/user");
require("dotenv").config();
const jwt=require("jsonwebtoken");

//auth
exports.auth = async (req, res, next) => {
    try {
        let token = req.cookies.token || req.body.token || '';

        // If the token is provided in the Authorization header, override the other sources
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.replace("Bearer ", "");
        }

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not found",
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            // Check for token expiration here if needed
            // const now = Date.now().valueOf() / 1000;
            // if (decode.exp < now) {
            //     return res.status(403).json({
            //         success: false,
            //         message: "Token has expired",
            //     });
            // }

            req.user = decode;
            next();
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "Token is invalid",
            });
        }
    } catch (error) {
        return res.status(405).json({
            success: false,
            message: "Token verification failed",
            data: error.message,
        });
    }
};


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
                message:"Something went wrong from client side"
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