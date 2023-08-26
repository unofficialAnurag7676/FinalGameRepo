
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback URL
router.get(
    "/auth/google/callback",
   // passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        if (!req.user) {
            // User not found, handle the response here
            console.log("responce",req);
            return res.status(301).json({
                success: false,
                message: "User not found",
               // profile: req.authInfo.profileData, // Access profileData from authInfo
            });
        }
        if(user)
        {
            //send token in cookie 
            return res.status(409).json({
                success:true,
                message:"User already exist",
            })
        }

        // Successful authentication, redirect or handle the response as needed
        res.redirect("/dashboard");
    }
);

module.exports = router;

