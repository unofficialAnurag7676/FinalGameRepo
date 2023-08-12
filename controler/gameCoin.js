const User=require("../model/user");
const GameCurency=require("../model/gameMoney");
const GameCurrency = require('../models/GameCurrency'); // Import the GameCurrency model

exports.increaseCoin = async (req, res) => {
  try {
    const { userID, gamecoinID, coinAmount } = req.body;

    if (!userID || !gamecoinID || !coinAmount) {
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

    // Find the game currency of the existing user
    const gameCurrency = await GameCurrency.findOneAndUpdate(
      { _id: gamecoinID, userDetails: userID }, // Find the game currency by ID and for the specified user
      { $inc: { coins: coinAmount } }, // Increment the coins field with the new amount
      { new: true } // To return the updated document
    ).populate('coin');

    if (!gameCurrency) {
      return res.status(404).json({
        success: false,
        message: "Game currency not found for the user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coins updated successfully",
      gameCurrency,
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
