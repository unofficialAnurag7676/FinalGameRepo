
const express = require("express");
const passport = require("passport");
const { generateToken } = require("../utils/generateToken");
const router = express.Router();

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback URL 
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),

    async (req, res) => {

        // Check if the authentication was successful (user found in the database)


        if (req.user.inDB === true) {
            // User was found, you can send a success response

            const token =await generateToken(req?.user?.userData?.email,
                req?.user?.userData?._id,req?.user?.userData?.accountType);

            console.log("token is",token);
            return res.status(200).json({
                success: true,
                message: "User authenticated",
                user:req.user.userData,
                token:token
            });
        } else {
            // User was not found, you can send a failure response with the profile data
            return res.status(301).json({
                success: false,
                message: "User not found",
                profile: req.user,
            });
        }
    }
);

module.exports = router;

