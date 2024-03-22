const payments = require("../models/payments.js");

const postPrices = async (req, res) => {
  const { country, monthlyPrice, weeklyPrice } = req.body;
  if (!country || !monthlyPrice || !weeklyPrice) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const newPrices = await payments.create({
      monthlyPrice,
      weeklyPrice,
      country,
    });
    if (newPrices) {
      res.status(201).json(newPrices);
    } else {
      res
        .status(400)
        .json({ error: "An error occured when creating new prices" });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getPrice = async (req, res) => {
  try {
    const priceRecord = await payments.findById(req.params.id);
    if (!priceRecord) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(priceRecord);
  } catch (error) {
    res.status(400).json("Unknown error: ", error);
  }
};

const getPrices = async (req, res) => {
  try {
    const priceRecords = await payments.find();
    res.status(200).json(priceRecords);
  } catch (error) {
    res.status(400).json("Unknown error: ", error);
  }
};
const updatePrice = async (req, res) => {
  const priceRecord = await payments.findById(req.params.id);
  if (!priceRecord) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const updatedPrice = await payments.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedPrice);
  } catch (error) {
    res.status(400).json(error);
  }
};
const deletPrice = async (req, res) => {
  try {
    const priceRecord = await payments.findById(req.params.id);
    if (!priceRecord) {
      return res.status(404).json({ error: "Not found" });
    }
    await payments.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "price record deleted" });
  } catch (error) {
    res.status(400).json("An error occured: ", error);
  }
};

module.exports = { postPrices, getPrice, getPrices, updatePrice, deletPrice };
