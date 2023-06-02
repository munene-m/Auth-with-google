const asyncHandler = require('express-async-handler')
const Sport = require('../models/Sport')
const multer = require("multer")
const cloudinary = require("cloudinary").v2

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
      console.log(file);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const createPrediction = asyncHandler(async (req, res) => {
    const { playerA, playerALeague, playerATime, playerB, playerBLeague, playerBTime, gamePrediction } = req.body;
  
    const playerALogo = req.files['playerALogo'][0];
    const playerBLogo = req.files['playerBLogo'][0];
  
    // Validate the presence of file fields
    if (!playerALogo || !playerBLogo) {
      res.status(400).json({ error: "All image files are required" });
      return;
    }
  
    try {
      const result = await cloudinary.uploader.upload(playerALogo.path, {
        width: 500,
        height: 500,
        crop: 'scale',
      });
  
      const result2 = await cloudinary.uploader.upload(playerBLogo.path, {
        width: 500,
        height: 500,
        crop: 'scale'
      });
  
      const prediction = await Sport.create({
        playerA, playerALeague, playerATime, playerB, playerBLeague, playerBTime, gamePrediction,
        playerALogo: result.secure_url,
        playerBLogo: result2.secure_url
      });
  
      res.status(201).json({
        _id: prediction._id,
        playerA: prediction.playerA,
        playerALeague: prediction.playerALeague,
        playerATime: prediction.playerATime,
        playerB: prediction.playerB,
        playerBLeague: prediction.playerBLeague,
        playerBTime: prediction.playerBTime,
        playerALogo: prediction.playerALogo,
        playerBLogo: prediction.playerBLogo,
        gamePrediction: prediction.gamePrediction
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred when creating the prediction" });
    }
  });

const updatePrediction = asyncHandler(async (req, res) => {
    const prediction = await Sport.findById(req.params.id);
  
    if (!prediction) {
      res.status(400);
      throw new Error("The prediction you tried to update does not exist");
    } else {
      const { playerA, playerALeague, playerATime, playerB, playerBLeague, playerBTime, gamePrediction } = req.body;
      let playerALogo = prediction.playerALogo;
      let playerBLogo = prediction.playerBLogo;
  
      if (req.file) {
        // If a new image is uploaded, update it in Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          width: 500,
          height: 500,
          crop: "scale",
          quality: 60
        });
        if (req.file.fieldname === "playerALogo") {
            playerALogo = result.secure_url;
        } else if (req.file.fieldname === "playerBLogo") {
            playerBLogo = result.secure_url;
        } 
      }
  
      const updatedPrediction = await Sport.findByIdAndUpdate(
        req.params.id,
        { playerA, playerALeague, playerATime, playerB, playerBLeague, playerBTime, gamePrediction, playerALogo, playerBLogo },
        { new: true }
      );
  
      res.status(200).json(updatedPrediction);
    }
  });

  const getPrediction = asyncHandler(async (req, res) => {
    const prediction = await Sport.findById(req.params.id)
    if(!prediction){
        res.status(400)
        throw new Error("This prediction does not exist")
    } else {
        res.status(200).json(prediction)
    }
})

const getPredictions = asyncHandler(async (req, res) => {
    try {
        const predictions = await Sport.find()
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
        const prediction = await Sport.findById(req.params.id)
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

  module.exports = { createPrediction, updatePrediction, getPrediction, getPredictions, deletePrediction }