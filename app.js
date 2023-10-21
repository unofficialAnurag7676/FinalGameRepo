/* IMPORT START */
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { dbConnect } = require("./config/connectDataBase");

//import googleauth controler
const passport = require("./controler/googleAuth");
const session = require("express-session");

const UserRoute = require("./routes/userRoutes");
const googleAuthRoutes = require("./routes/googleAuth");
const adminRoutes = require("./routes/Admin");
const paymentsRoutes = require("./routes/payment");
const webhook = require("./routes/webhook");

app.use(
  cors({
    origin: [
      "https://chimerical-heliotrope-a7ceb5.netlify.app",
      "https://fancy-cannoli-c32714.netlify.app",
    ],
  })
);

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

//connect database
dbConnect();

app.use("/api/v1", webhook);

app.use(express.json());
app.use(cookieParser());

//instantiate froentend request

//file upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Use Google authentication routes
app.use("/", googleAuthRoutes);

//mounts routs
app.use("/api/v1/auth", UserRoute);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/payment", paymentsRoutes);

//call-back route
//adding callback router
app.get("/dashboard", (req, res) => {
  res.send("<h1>Dashboard</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`your server is running on on port :${process.env.PORT}`);
  return `<h1>Hellow World </h1>`;
});
