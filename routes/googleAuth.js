const express = require("express");
const passport = require("passport");
const router = express.Router();


// Redirect to Google for authentication
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback URL
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Successful authentication, redirect or handle the response as needed
        res.redirect("/dashboard");
    }
);

module.exports = router;