const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    country: {
      type: String,
    },
    weeklyPrice: {
      type: Number,
    },
    monthlyPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

const payment = mongoose.model("currencyPrices", paymentSchema);
module.exports = payment;
