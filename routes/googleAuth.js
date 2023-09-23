
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
        if (req.user.inDB === true) {
            const token = await generateToken(req?.user?.userData?.email,
                req?.user?.userData?._id, req?.user?.userData?.accountType);

  

            // Send a message to the parent window (Unity WebGL) with the token
            const data = {
                success: true,
                message: "User authenticated",
                user: req.user.userData,
                token: token
            };

            // Use window.opener.postMessage to send the data
           const script = `
    window.opener.postMessage(${JSON.stringify(data).replace(/</g, '\\u003c')}, '*');
    window.close();
`;

            res.send(script);
        } else {
            // User not found, send a message with profile data
            const data = {
                success: false,
                message: "User not found",
                profile: req.user
            };

            // Use window.opener.postMessage to send the data
           const script = `
    window.opener.postMessage(${JSON.stringify(data).replace(/</g, '\\u003c')}, '*');
    window.close();
`;

            res.send(script);
        }
    }
);

module.exports = router;

