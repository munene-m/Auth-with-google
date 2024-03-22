const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    country: {
      type: String,
    },
    weeklyPrice: {
      type: String,
    },
    monthlyPrice: {
      type: String,
    },
  },
  { timestamps: true }
);

const payment = mongoose.model("currencyPrices", paymentSchema);
module.exports = payment;
