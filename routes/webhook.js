const express = require("express");
const router = express.Router();
const { paymetnSuccess } = require("../controler/BuyCoins");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymetnSuccess
);

module.exports = router;
