const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User=require("../model/user")

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALL_BACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                console.log(profile)
                // Getting email
                const userEmail = profile.emails.find(email => email.verified);

                // Find the user based on Google profile data
                const user = await User.findOne({ email: userEmail.value });

                if (user) {
                    // User already exists, return the user
                    return done(null, user);
                } else {
                    // User not found, return false with profile data
                    return done(null, false, { profileData: profile });
                }
            } catch (error) {
                done(error, false);
            }
        }
    )
);


module.exports = passport;