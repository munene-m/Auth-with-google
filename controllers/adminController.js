const Admin = require("../models/Admin");
const asyncHandler = require("express-async-handler");

const createPrediction = asyncHandler(async (req, res) => {
  const { time, tip, match, position, formation } = req.body;
  if (!time || !tip || !match || !position || !formation) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }
  try {
    const prediction = await Admin.create({
      match,
      formation,
      position,
      time,
      tip,
    });
    if (prediction) {
      res.status(201).json({
        _id: prediction.id,
        match: prediction.match,
        formation: prediction.formation,
        position: prediction.position,
        time: prediction.time,
        tip: prediction.tip,
      });
    } else {
      res.status(400).json("An error occurred when creating the prediction");
    }
  } catch (err) {
    console.log(err);
  }
});

const updatePrediction = asyncHandler(async (req, res) => {
  try {
    const prediction = await Admin.findById(req.params.id);
    if (!prediction) {
      res.status(404);
      throw new Error("Prediction not found");
    }
    const updatedPrediction = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPrediction);
  } catch (err) {
    console.log(err);
  }
});

const getPrediction = asyncHandler(async (req, res) => {
    const prediction = await Admin.findById(req.params.id)
    if(!prediction){
        res.status(400)
        throw new Error("This prediction does not exist")
    } else {
        res.status(200).json(prediction)
    }
})

const getPredictions = asyncHandler(async (req, res) => {
    try {
        const predictions = await Admin.find()
        if(!predictions){
            res.status(400)
            throw new Error("There are no predictions")
        }
        res.status(200).json(predictions)
    } catch (err) {
    console.log(err);        
    }
})

const deletePrediction = asyncHandler(async (req, res) => {
    try {
        const prediction = await Admin.findById(req.params.id)
        if (!prediction) {
            res.status(404);
            throw new Error("Prediction not found");
          }
        await Admin.findByIdAndDelete(req.params.id)
        res.status(200).json({id: req.params.id, message: "Prediction deleted"})
    } catch (err) {
        console.log(err);
    }
})

module.exports = {
    createPrediction, updatePrediction, getPrediction, getPredictions, deletePrediction
}