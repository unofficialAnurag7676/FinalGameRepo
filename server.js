/* IMPORT START */
const express=require("express");
const app=express();
const fileUpload=require("express-fileupload");
const cookieParser=require("cookie-parser");
require("dotenv").config();
const {dbConnect}=require('./config/connectDataBase');

//
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const UserRoute=require("./routes/userRoutes")
const googleAuthRoutes=require("./routes/googleAuth")

passport.serializeUser((user, done) => {
    done(null, user); // Serialize user object into the session
});

passport.deserializeUser((user, done) => {
    done(null, user); // Deserialize user object from the session
});
app.use(passport.initialize());
app.use(
    session({
        secret: "suman203", // Change this to a strong and secure key
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
// Use Google authentication routes
app.use("/", googleAuthRoutes);
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:process.env.CALL_BACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            // Profile contains user information from Google
            // You can create or find a user based on the profile data
            // Call the done() function with the user object
             done(null, profile);
            console.log(profile);
        }
    )
);


app.get("/dashboard", (req, res) => {
    res.send("<h1>Dashboard</h1>");
});

/*** IMPORT END ** */

//connect database
dbConnect();

app.use(express.json());
app.use(cookieParser());

//file upload middleware
app.use(
    fileUpload({
         useTempFiles:true,
         tempFileDir:"/tmp"
    })
)

//mounts routs
app.use("/api/v1/auth",UserRoute);

app.listen(process.env.PORT,()=>{
    console.log(`your server is running on on port :${process.env.PORT}`);
    return `<h1>Hellowworld </h1>`
});