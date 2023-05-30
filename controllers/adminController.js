const Admin = require("../models/Admin");
const asyncHandler = require("express-async-handler");
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
  const { time, tip, match, formation, league, category, teamA, teamB, teamAscore, teamBscore } = req.body;

  const leagueIcon = req.files['leagueIcon'][0];
  const teamAIcon = req.files['teamAIcon'][0];
  const teamBIcon = req.files['teamBIcon'][0];

  // Validate the presence of file fields
  if (!leagueIcon || !teamAIcon || !teamBIcon) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    const result = await cloudinary.uploader.upload(leagueIcon.path, {
      width: 500,
      height: 500,
      crop: 'scale',
    });

    const result2 = await cloudinary.uploader.upload(teamAIcon.path, {
      width: 500,
      height: 500,
      crop: 'scale'
    });

    const result3 = await cloudinary.uploader.upload(teamBIcon.path, {
      width: 500,
      height: 500,
      crop: 'scale'
    });

    const prediction = await Admin.create({
      time, tip, match, formation, league, category,teamA, teamB, teamAscore, teamBscore,
      leagueIcon: result.secure_url,
      teamAIcon: result2.secure_url,
      teamBIcon: result3.secure_url
    });

    res.status(201).json({
      _id: prediction._id,
      time: prediction.time,
      tip: prediction.tip,
      match: prediction.match,
      formation: prediction.formation,
      teamA: prediction.teamA,
      teamB: prediction.teamB,
      teamAscore: prediction.teamAscore,
      teamBscore: prediction. teamBscore,
      league: prediction.league,
      category: prediction.category,
      leagueIcon: prediction.leagueIcon,
      teamAIcon: prediction.teamAIcon,
      teamBIcon: prediction.teamBIcon
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred when creating the prediction" });
  }
});


const updatePrediction = asyncHandler(async (req, res) => {
  const prediction = await Admin.findById(req.params.id);

  if (!prediction) {
    res.status(400);
    throw new Error("The prediction you tried to update does not exist");
  } else {
    const { time, tip, match, formation, league, category, teamA, teamB, teamAscore, teamBscore } = req.body;
    let leagueIcon = prediction.leagueIcon;
    let teamAIcon = prediction.teamAIcon;
    let teamBIcon = prediction.teamBIcon;

    if (req.file) {
      // If a new image is uploaded, update it in Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: 500,
        height: 500,
        crop: "scale",
        quality: 60
      });
      if (req.file.fieldname === "leagueIcon") {
        leagueIcon = result.secure_url;
      } else if (req.file.fieldname === "teamAIcon") {
        teamAIcon = result.secure_url;
      } else if (req.file.fieldname === "teamBIcon") {
        teamBIcon = result.secure_url;
      }
    }

    const updatedPrediction = await Admin.findByIdAndUpdate(
      req.params.id,
      { time, tip, match, formation, league, category, leagueIcon, teamAIcon, teamBIcon, teamA, teamB, teamAscore, teamBscore },
      { new: true }
    );

    res.status(200).json(updatedPrediction);
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

const getPredictionInCategory = asyncHandler(async (req, res) => {
  const prediction = await Admin.find({category: decodeURIComponent(req.params.value)})
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
    createPrediction, updatePrediction, getPrediction, getPredictionInCategory, getPredictions, deletePrediction
}