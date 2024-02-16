const Admin = require("../models/prediction");
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

const handleImageUpload = async (imageFile) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile.path);
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading image");
  }
};

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
    statistics,
  } = req.body;

  // Assuming leagueIcon, teamAIcon, and teamBIcon are sent as strings or files
  const leagueIcon = req.files["leagueIcon"]
    ? req.files["leagueIcon"][0]
    : req.body["leagueIcon"];
  const teamAIcon = req.files["teamAIcon"]
    ? req.files["teamAIcon"][0]
    : req.body["teamAIcon"];
  const teamBIcon = req.files["teamBIcon"]
    ? req.files["teamBIcon"][0]
    : req.body["teamBIcon"];

  // Validate the presence of file fields if they are sent as files
  if (
    (req.files["leagueIcon"] ||
      req.files["teamAIcon"] ||
      req.files["teamBIcon"]) &&
    (!leagueIcon || !teamAIcon || !teamBIcon)
  ) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    let leagueIconUrl, teamAIconUrl, teamBIconUrl;

    if (req.files["leagueIcon"]) {
      leagueIconUrl = await handleImageUpload(leagueIcon);
    } else {
      leagueIconUrl = leagueIcon;
      if (typeof leagueIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid leagueIcon URL" });
      }
    }

    if (req.files["teamAIcon"]) {
      teamAIconUrl = await handleImageUpload(teamAIcon);
    } else {
      teamAIconUrl = teamAIcon;
      if (typeof teamAIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamAIcon URL" });
      }
    }

    if (req.files["teamBIcon"]) {
      teamBIconUrl = await handleImageUpload(teamBIcon);
    } else {
      teamBIconUrl = teamBIcon;
      if (typeof teamBIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamBIcon URL" });
      }
    }
    const parsedStats = JSON.parse(statistics);

    const prediction = await Admin.create({
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
      date,
      statistics: parsedStats,
      description,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl,
    });

    res.status(201).json({ ...prediction.toObject() });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occurred when creating the prediction" });
  }
};

const createVipPrediction = async (req, res) => {
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
    statistics,
  } = req.body;
  const vip = req.params.vip;

  // Assuming leagueIcon, teamAIcon, and teamBIcon are sent as strings or files
  const leagueIcon = req.files["leagueIcon"]
    ? req.files["leagueIcon"][0]
    : req.body["leagueIcon"];
  const teamAIcon = req.files["teamAIcon"]
    ? req.files["teamAIcon"][0]
    : req.body["teamAIcon"];
  const teamBIcon = req.files["teamBIcon"]
    ? req.files["teamBIcon"][0]
    : req.body["teamBIcon"];

  if (
    (req.files["leagueIcon"] ||
      req.files["teamAIcon"] ||
      req.files["teamBIcon"]) &&
    (!leagueIcon || !teamAIcon || !teamBIcon)
  ) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    let leagueIconUrl, teamAIconUrl, teamBIconUrl;

    if (req.files["leagueIcon"]) {
      leagueIconUrl = await handleImageUpload(leagueIcon);
    } else {
      leagueIconUrl = leagueIcon;
      if (typeof leagueIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid leagueIcon URL" });
      }
    }

    if (req.files["teamAIcon"]) {
      teamAIconUrl = await handleImageUpload(teamAIcon);
    } else {
      teamAIconUrl = teamAIcon;
      if (typeof teamAIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamAIcon URL" });
      }
    }

    if (req.files["teamBIcon"]) {
      teamBIconUrl = await handleImageUpload(teamBIcon);
    } else {
      teamBIconUrl = teamBIcon;
      if (typeof teamBIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamBIcon URL" });
      }
    }

    const parsedStats = JSON.parse(statistics);

    const prediction = await Admin.create({
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
      date,
      description,
      statistics: parsedStats,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl,
    });

    res.status(201).json({ ...prediction.toObject() });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occurred when creating the prediction" });
  }
};

const createFreeTip = async (req, res) => {
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
    statistics,
  } = req.body;
  const freeTip = req.params.freeTip;

  const leagueIcon = req.files["leagueIcon"]
    ? req.files["leagueIcon"][0]
    : req.body["leagueIcon"];
  const teamAIcon = req.files["teamAIcon"]
    ? req.files["teamAIcon"][0]
    : req.body["teamAIcon"];
  const teamBIcon = req.files["teamBIcon"]
    ? req.files["teamBIcon"][0]
    : req.body["teamBIcon"];

  if (
    (req.files["leagueIcon"] ||
      req.files["teamAIcon"] ||
      req.files["teamBIcon"]) &&
    (!leagueIcon || !teamAIcon || !teamBIcon)
  ) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    let leagueIconUrl, teamAIconUrl, teamBIconUrl;

    if (req.files["leagueIcon"]) {
      leagueIconUrl = await handleImageUpload(leagueIcon);
    } else {
      leagueIconUrl = leagueIcon;
      if (typeof leagueIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid leagueIcon URL" });
      }
    }

    if (req.files["teamAIcon"]) {
      teamAIconUrl = await handleImageUpload(teamAIcon);
    } else {
      teamAIconUrl = teamAIcon;
      if (typeof teamAIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamAIcon URL" });
      }
    }

    if (req.files["teamBIcon"]) {
      teamBIconUrl = await handleImageUpload(teamBIcon);
    } else {
      teamBIconUrl = teamBIcon;
      if (typeof teamBIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamBIcon URL" });
      }
    }

    const parsedStats = JSON.parse(statistics);
    const prediction = await Admin.create({
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
      freeTip,
      date,
      description,
      statistics: parsedStats,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl,
    });

    res.status(201).json({ ...prediction.toObject() });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occurred when creating the prediction" });
  }
};

const createUpcoming = async (req, res) => {
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
    statistics,
    description,
  } = req.body;
  const upcoming = req.params.upcoming;

  const leagueIcon = req.files["leagueIcon"]
    ? req.files["leagueIcon"][0]
    : req.body["leagueIcon"];
  const teamAIcon = req.files["teamAIcon"]
    ? req.files["teamAIcon"][0]
    : req.body["teamAIcon"];
  const teamBIcon = req.files["teamBIcon"]
    ? req.files["teamBIcon"][0]
    : req.body["teamBIcon"];

  if (
    (req.files["leagueIcon"] ||
      req.files["teamAIcon"] ||
      req.files["teamBIcon"]) &&
    (!leagueIcon || !teamAIcon || !teamBIcon)
  ) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    let leagueIconUrl, teamAIconUrl, teamBIconUrl;

    if (req.files["leagueIcon"]) {
      leagueIconUrl = await handleImageUpload(leagueIcon);
    } else {
      leagueIconUrl = leagueIcon;
      if (typeof leagueIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid leagueIcon URL" });
      }
    }

    if (req.files["teamAIcon"]) {
      teamAIconUrl = await handleImageUpload(teamAIcon);
    } else {
      teamAIconUrl = teamAIcon;
      if (typeof teamAIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamAIcon URL" });
      }
    }

    if (req.files["teamBIcon"]) {
      teamBIconUrl = await handleImageUpload(teamBIcon);
    } else {
      teamBIconUrl = teamBIcon;
      if (typeof teamBIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamBIcon URL" });
      }
    }
    const parsedStats = JSON.parse(statistics);

    const prediction = await Admin.create({
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
      upcoming,
      date,
      description,
      statistics: parsedStats,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl,
    });

    res.status(201).json({ ...prediction.toObject() });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occurred when creating the prediction" });
  }
};

const createBetOfTheDay = async (req, res) => {
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
    statistics,
  } = req.body;
  const betOfTheDay = req.params.betOfTheDay;

  const leagueIcon = req.files["leagueIcon"]
    ? req.files["leagueIcon"][0]
    : req.body["leagueIcon"];
  const teamAIcon = req.files["teamAIcon"]
    ? req.files["teamAIcon"][0]
    : req.body["teamAIcon"];
  const teamBIcon = req.files["teamBIcon"]
    ? req.files["teamBIcon"][0]
    : req.body["teamBIcon"];

  if (
    (req.files["leagueIcon"] ||
      req.files["teamAIcon"] ||
      req.files["teamBIcon"]) &&
    (!leagueIcon || !teamAIcon || !teamBIcon)
  ) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    let leagueIconUrl, teamAIconUrl, teamBIconUrl;

    if (req.files["leagueIcon"]) {
      leagueIconUrl = await handleImageUpload(leagueIcon);
    } else {
      leagueIconUrl = leagueIcon;
      if (typeof leagueIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid leagueIcon URL" });
      }
    }

    if (req.files["teamAIcon"]) {
      teamAIconUrl = await handleImageUpload(teamAIcon);
    } else {
      teamAIconUrl = teamAIcon;
      if (typeof teamAIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamAIcon URL" });
      }
    }

    if (req.files["teamBIcon"]) {
      teamBIconUrl = await handleImageUpload(teamBIcon);
    } else {
      teamBIconUrl = teamBIcon;
      if (typeof teamBIconUrl !== "string") {
        return res.status(400).json({ error: "Invalid teamBIcon URL" });
      }
    }

    const prediction = await Admin.create({
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
      betOfTheDay,
      date,
      description,
      statistics: parsedStats,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl,
    });

    res.status(201).json({ ...prediction.toObject() });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "An error occurred when creating the prediction" });
  }
};

const updatePrediction = async (req, res) => {
  try {
    const prediction = await Admin.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    // Extract fields from request body
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
      statistics, // Assuming statistics is part of the request body
    } = req.body;

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
      showScore,
      date,
      description,
    };

    // Include statistics in updateFields if it exists in the request body
    if (statistics !== undefined) {
      // Parse statistics if it exists in the request body
      const parsedStatistics = statistics ? JSON.parse(statistics) : null;
      updateFields.statistics = parsedStatistics;
    }

    // Find and update the prediction
    const updatedPrediction = await Admin.findByIdAndUpdate(
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
    const prediction = await Admin.findOne({
      // _id: req.params.id,
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

const getVipPredictions = async (req, res) => {
  try {
    // const date = req.params.date
    const predictions = await Admin.find({
      vip: decodeURIComponent(req.params.value),
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

const getFreeTips = async (req, res) => {
  try {
    const predictions = await Admin.find({
      freeTip: decodeURIComponent(req.params.value),
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

const getUpcoming = async (req, res) => {
  try {
    const predictions = await Admin.find({
      upcoming: decodeURIComponent(req.params.value),
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

const getBetOfTheDay = async (req, res) => {
  try {
    const predictions = await Admin.find({
      betOfTheDay: decodeURIComponent(req.params.value),
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

const getPredictionInCategory = async (req, res) => {
  const predictions = await Admin.find({
    category: decodeURIComponent(req.params.value),
    date: req.params.date,
  });
  if (!predictions) {
    return res.status(404).json({ message: "Prediction does not exist" });
  } else {
    res.status(200).json(predictions);
  }
};

const getPredictions = async (req, res) => {
  try {
    const predictions = await Admin.find({
      date: req.params.date,
      category: { $exists: true },
    });
    if (!predictions) {
      return res.status(404).json({ message: "Predictions not found" });
    } else {
      res.status(200).json(predictions);
    }

    return;
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: "An error occurred when fetching predictions" });
  }
};

const deletePrediction = async (req, res) => {
  try {
    const prediction = await Admin.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: "Prediction deleted" });
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createPrediction,
  createVipPrediction,
  createFreeTip,
  createBetOfTheDay,
  createUpcoming,
  updatePrediction,
  getPrediction,
  getBetOfTheDay,
  getUpcoming,
  getFreeTips,
  getVipPredictions,
  getPredictionInCategory,
  getPredictions,
  deletePrediction,
};
