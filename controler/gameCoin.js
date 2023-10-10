const User = require("../model/user");
// const GameCurency = require("../model/gameMoney");
// const GameCurrency = require("../models/GameCurrency"); // Import the GameCurrency model

exports.decreaseCoin = async (req, res) => {
  try {
    const { userID, count } = req.body;

    let Amount = 0;
    if (count == TEN) {
      Amount = 10;
    } else if (count === HUNDRED) {
      Amount = 100;
    } else {
      return res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!userID || !Amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Find the user
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.currentCoin >= Amount) {
      user.currentCoin -= Amount;
      // Save the updated user object back to the database
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Coins updated successfully",
      });
    } else if (user.totalCash >= Amount) {
      user.totalCash -= Amount;
      // Save the updated user object back to the database
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Coins updated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "not enough coins available",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in updating coins",
      data: error.message,
    });
  }
};

exports.increaseCoin = async (req, res) => {
  try {
    const { userID, count, type } = req.body;
    let Amount = 0;
    if (count == TEN) {
      Amount = 10;
    } else if (count === HUNDRED) {
      Amount = 100;
    } else {
      return res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }

    if (!userID || !Amount || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Find the user
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (type === CASH) {
      user.totalCash += Amount;
      // Save the updated user object back to the database
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Coins updated successfully",
      });
    } else if (type === COIN) {
      user.currentCoin += Amount;
      // Save the updated user object back to the database
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Coins updated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in updating coins",
      data: error.message,
    });
  }
};
