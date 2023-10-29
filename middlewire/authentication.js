const User = require("../model/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Session = require("../model/session"); // Assuming you have a session schema

//auth

exports.auth = async (req, res, next) => {
  try {
    let token = req.cookies.token || req.body.token || "";

    // If the token is provided in the Authorization header, override the other sources
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
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

      // Check the session's validity in the database
      const session = await Session.findOne({
        session_id: decode.session_id,
        phone_number: decode.phone,
      });
      if (!session) {
        return res.status(403).json({
          success: false,
          message: "Session is invalid",
        });
      }

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
exports.isGammer = async (req, res, next) => {
  try {
    if (req.user.role !== "Gammer") {
      return res.status(500).json({
        success: false,
        message: "Not a valid account",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in account validation",
    });
  }
};

//confirm Admin account
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role != "Admin") {
      return res.status(500).json({
        success: false,
        message: "Something went wrong from client side",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in admin route",
    });
  }
};
