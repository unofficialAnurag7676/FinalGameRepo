const User = require("../model/user");
// const GameCurency = require("../model/gameMoney");
// const GameCurrency = require("../models/GameCurrency"); // Import the GameCurrency model
const TEN = "TEN";
const HUNDRED = "HUNDRED";
const CASH = "CASH";
const COIN = "COIN";

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
    } else if (user.totalCash >= Amount) {
      user.totalCash -= Amount;
    } else {
      return res.status(400).json({
        success: false,
        message: "not enough coins available",
      });
    }

    // Update lastTournamentFee and tournamentStreak
    user.lastTournamentFee = count;
    user.tournamentStreak = 0;

    // Save the updated user object back to the database
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Coins updated successfully",
    });
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
    } else if (type === COIN) {
      user.currentCoin += Amount;
    } else {
      return res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }

    // Set lastTournamentFee to the count
    user.lastTournamentFee = count;

    // Increment tournamentStreak by one (with a maximum of 3)
    if (user.tournamentStreak < 3) {
      user.tournamentStreak += 1;
    }

    // Save the updated user object back to the database
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Coins updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in updating coins",
      data: error.message,
    });
  }
};
