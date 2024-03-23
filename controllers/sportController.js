const Sport = require("../models/Sport");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

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
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createPrediction = async (req, res) => {
  const {
    time,
    tip,
    status,
    formationA,
    formationB,
    league,
    teamAPosition,
    teamBPosition,
    category,
    teamA,
    teamB,
    teamAscore,
    teamBscore,
    date,
    description,
  } = req.body;
  const sport = req.params.sport;

  const leagueIcon = req.files["leagueIcon"][0];
  const teamAIcon = req.files["teamAIcon"][0];
  const teamBIcon = req.files["teamBIcon"][0];

  // Validate the presence of file fields
  if (!leagueIcon || !teamAIcon || !teamBIcon) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    const result = await cloudinary.uploader.upload(leagueIcon.path, {
      crop: "scale",
    });

    const result2 = await cloudinary.uploader.upload(teamAIcon.path, {
      crop: "scale",
    });

    const result3 = await cloudinary.uploader.upload(teamBIcon.path, {
      crop: "scale",
    });

    const prediction = await Sport.create({
      time,
      tip,
      status,
      formationA,
      formationB,
      teamAPosition,
      teamBPosition,
      league,
      category,
      teamA,
      teamB,
      teamAscore,
      teamBscore,
      sport,
      date,
      description,
      leagueIcon: result.secure_url,
      teamAIcon: result2.secure_url,
      teamBIcon: result3.secure_url,
    });

    res.status(201).json({
      ...prediction.toObject(),
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occurred when creating the prediction" });
  }
};

const updatePrediction = async (req, res) => {
  try {
    const prediction = await Sport.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    const {
      time,
      tip,
      status,
      formationA,
      formationB,
      league,
      teamAPosition,
      teamBPosition,
      category,
      teamA,
      teamB,
      teamAscore,
      teamBscore,
      showScore,
      date,
      description,
    } = req.body;
    const vip = req.params.vip;

    let leagueIcon = prediction.leagueIcon;
    let teamAIcon = prediction.teamAIcon;
    let teamBIcon = prediction.teamBIcon;

    // Handle image uploads
    const handleImageUpload = async (fieldName, defaultUrl) => {
      if (req.files[fieldName]) {
        const result = await cloudinary.uploader.upload(
          req.files[fieldName][0].path,
          { crop: "scale" }
        );
        return result.secure_url;
      }
      return defaultUrl;
    };

    // Update leagueIcon, teamAIcon, and teamBIcon if new files are provided
    leagueIcon = await handleImageUpload("leagueIcon", leagueIcon);
    teamAIcon = await handleImageUpload("teamAIcon", teamAIcon);
    teamBIcon = await handleImageUpload("teamBIcon", teamBIcon);

    // Prepare updateFields object with mandatory fields
    const updateFields = {
      time,
      tip,
      status,
      formationA,
      formationB,
      teamAPosition,
      teamBPosition,
      league,
      category,
      teamA,
      teamB,
      teamAscore,
      teamBscore,
      vip,
      showScore,
      date,
      leagueIcon,
      teamAIcon,
      teamBIcon,
      description,
    };

    // Find and update the prediction
    const updatedPrediction = await Sport.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    // Return the updated prediction
    res.status(200).json(updatedPrediction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};

const getPrediction = async (req, res) => {
  try {
    const prediction = await Sport.findOne({
      date: req.params.date,
      teamA: req.params.teamA,
      teamB: req.params.teamB,
    });
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    } else {
      res.status(200).json(prediction);
    }
  } catch (err) {
    console.log(err);
  }
};

const getPredictionFromSport = async (req, res) => {
  try {
    const predictions = await Sport.find({
      sport: decodeURIComponent(req.params.value),
      date: req.params.date,
    });
    if (!predictions) {
      return res.status(404).json({ message: "Prediction not found" });
    } else {
      res.status(200).json(predictions);
    }
  } catch (err) {
    console.log(err);
  }
};

const getPredictions = async (req, res) => {
  try {
    const predictions = await Sport.find({
      date: req.params.date,
      category: { $exists: true },
    });
    if (!predictions) {
      return res.status(404).json({ message: "Predictions not found" });
    } else {
      res.status(200).json(predictions);
    }
  } catch (err) {
    console.log(err);
  }
};

const deletePrediction = async (req, res) => {
  try {
    const prediction = await Sport.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    await Sport.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: "Prediction deleted" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createPrediction,
  updatePrediction,
  getPrediction,
  getPredictionFromSport,
  getPredictions,
  deletePrediction,
};
