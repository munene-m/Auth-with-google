const Admin = require("../models/Admin");
const asyncHandler = require("express-async-handler");
const multer = require("multer")
const moment = require("moment")
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

const handleImageUpload = async (imageFile) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile.path, {
      width: 500,
      height: 500,
      crop: 'scale',
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading image");
  }
};

const createPrediction = asyncHandler(async (req, res) => {
  const { time, tip, status, formationA, formationB, league, teamAPosition, teamBPosition, category, teamA, teamB, teamAscore, teamBscore, date } = req.body;

  const leagueIcon = req.files['leagueIcon'][0];
  const teamAIcon = req.files['teamAIcon'][0];
  const teamBIcon = req.files['teamBIcon'][0];

  // Validate the presence of file fields
  if (!leagueIcon || !teamAIcon || !teamBIcon) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    const leagueIconUrl = await handleImageUpload(leagueIcon);
    const teamAIconUrl = await handleImageUpload(teamAIcon);
    const teamBIconUrl = await handleImageUpload(teamBIcon);

    const prediction = await Admin.create({
      time, tip, status, formationA, formationB, teamAPosition, teamBPosition, league, category,teamA, teamB, teamAscore, teamBscore,date,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl
    });

    res.status(201).json({
      _id: prediction._id,
      time: prediction.time,
      tip: prediction.tip,
      status: prediction.status,
      formationA: prediction.formationA,
      formationB: prediction.formationB,
      teamA: prediction.teamA,
      teamB: prediction.teamB,
      teamAscore: prediction.teamAscore,
      teamBscore: prediction. teamBscore,
      teamAPosition: prediction.teamAPosition,
      teamBPosition: prediction.teamBPosition,
      league: prediction.league,
      category: prediction.category,
      leagueIcon: prediction.leagueIcon,
      teamAIcon: prediction.teamAIcon,
      teamBIcon: prediction.teamBIcon,
      date: prediction.date
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred when creating the prediction" });
  }
});

const createVipPrediction = asyncHandler(async (req, res) => {
  const { time, tip, status, formationA, formationB, league, teamAPosition, teamBPosition, category, teamA, teamB, teamAscore, teamBscore, date } = req.body;
  const vip = req.params.vip

  const leagueIcon = req.files['leagueIcon'][0];
  const teamAIcon = req.files['teamAIcon'][0];
  const teamBIcon = req.files['teamBIcon'][0];

  // Validate the presence of file fields
  if (!leagueIcon || !teamAIcon || !teamBIcon) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    const leagueIconUrl = await handleImageUpload(leagueIcon);
    const teamAIconUrl = await handleImageUpload(teamAIcon);
    const teamBIconUrl = await handleImageUpload(teamBIcon);

    const prediction = await Admin.create({
      time, tip, status, formationA, formationB, teamAPosition, teamBPosition, league, category,teamA, teamB, teamAscore, teamBscore, vip,date,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl
    });

    res.status(201).json({
      _id: prediction._id,
      time: prediction.time,
      tip: prediction.tip,
      status: prediction.status,
      formationA: prediction.formationA,
      formationB: prediction.formationB,
      teamA: prediction.teamA,
      teamB: prediction.teamB,
      teamAscore: prediction.teamAscore,
      teamBscore: prediction. teamBscore,
      teamAPosition: prediction.teamAPosition,
      teamBPosition: prediction.teamBPosition,
      league: prediction.league,
      category: prediction.category,
      leagueIcon: prediction.leagueIcon,
      teamAIcon: prediction.teamAIcon,
      teamBIcon: prediction.teamBIcon,
      vip: prediction.vip, 
      date: prediction.date
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred when creating the prediction" });
  }
});

const createFreeTip = asyncHandler(async (req, res) => {
  const { time, tip, status, formationA, formationB, league, teamAPosition, teamBPosition, category, teamA, teamB, teamAscore, teamBscore, date } = req.body;
  const freeTip = req.params.freeTip

  const leagueIcon = req.files['leagueIcon'][0];
  const teamAIcon = req.files['teamAIcon'][0];
  const teamBIcon = req.files['teamBIcon'][0];

  // Validate the presence of file fields
  if (!leagueIcon || !teamAIcon || !teamBIcon) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    const leagueIconUrl = await handleImageUpload(leagueIcon);
    const teamAIconUrl = await handleImageUpload(teamAIcon);
    const teamBIconUrl = await handleImageUpload(teamBIcon);

    const prediction = await Admin.create({
      time, tip, status, formationA, formationB, teamAPosition, teamBPosition, league, category,teamA, teamB, teamAscore, teamBscore, freeTip,date,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl
    });

    res.status(201).json({
      _id: prediction._id,
      time: prediction.time,
      tip: prediction.tip,
      status: prediction.status,
      formationA: prediction.formationA,
      formationB: prediction.formationB,
      teamA: prediction.teamA,
      teamB: prediction.teamB,
      teamAscore: prediction.teamAscore,
      teamBscore: prediction. teamBscore,
      teamAPosition: prediction.teamAPosition,
      teamBPosition: prediction.teamBPosition,
      league: prediction.league,
      category: prediction.category,
      leagueIcon: prediction.leagueIcon,
      teamAIcon: prediction.teamAIcon,
      teamBIcon: prediction.teamBIcon,
      freeTip: prediction.freeTip,
      date: prediction.date
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred when creating the prediction" });
  }
});

const createUpcoming = asyncHandler(async (req, res) => {
  const { time, tip, status, formationA, formationB, league, teamAPosition, teamBPosition, category, teamA, teamB, teamAscore, teamBscore, date } = req.body;
  const upcoming = req.params.upcoming

  const leagueIcon = req.files['leagueIcon'][0];
  const teamAIcon = req.files['teamAIcon'][0];
  const teamBIcon = req.files['teamBIcon'][0];

  // Validate the presence of file fields
  if (!leagueIcon || !teamAIcon || !teamBIcon) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    const leagueIconUrl = await handleImageUpload(leagueIcon);
    const teamAIconUrl = await handleImageUpload(teamAIcon);
    const teamBIconUrl = await handleImageUpload(teamBIcon);

    const prediction = await Admin.create({
      time, tip, status, formationA, formationB, teamAPosition, teamBPosition, league, category,teamA, teamB, teamAscore, teamBscore, upcoming, date,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl
    });

    res.status(201).json({
      _id: prediction._id,
      time: prediction.time,
      tip: prediction.tip,
      status: prediction.status,
      formationA: prediction.formationA,
      formationB: prediction.formationB,
      teamA: prediction.teamA,
      teamB: prediction.teamB,
      teamAscore: prediction.teamAscore,
      teamBscore: prediction. teamBscore,
      teamAPosition: prediction.teamAPosition,
      teamBPosition: prediction.teamBPosition,
      league: prediction.league,
      category: prediction.category,
      leagueIcon: prediction.leagueIcon,
      teamAIcon: prediction.teamAIcon,
      teamBIcon: prediction.teamBIcon,
      upcoming: prediction.upcoming,
      date: prediction.date
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred when creating the prediction" });
  }
});

const createBetOfTheDay = asyncHandler(async (req, res) => {
  const { time, tip, status, formationA, formationB, league, teamAPosition, teamBPosition, category, teamA, teamB, teamAscore, teamBscore, date } = req.body;
  const betOfTheDay = req.params.betOfTheDay

  const leagueIcon = req.files['leagueIcon'][0];
  const teamAIcon = req.files['teamAIcon'][0];
  const teamBIcon = req.files['teamBIcon'][0];

  // Validate the presence of file fields
  if (!leagueIcon || !teamAIcon || !teamBIcon) {
    res.status(400).json({ error: "All image files are required" });
    return;
  }

  try {
    const leagueIconUrl = await handleImageUpload(leagueIcon);
    const teamAIconUrl = await handleImageUpload(teamAIcon);
    const teamBIconUrl = await handleImageUpload(teamBIcon);

    const prediction = await Admin.create({
      time, tip, status, formationA, formationB, teamAPosition, teamBPosition, league, category,teamA, teamB, teamAscore, teamBscore, betOfTheDay, date,
      leagueIcon: leagueIconUrl,
      teamAIcon: teamAIconUrl,
      teamBIcon: teamBIconUrl
    });

    res.status(201).json({
      _id: prediction._id,
      time: prediction.time,
      tip: prediction.tip,
      status: prediction.status,
      formationA: prediction.formationA,
      formationB: prediction.formationB,
      teamA: prediction.teamA,
      teamB: prediction.teamB,
      teamAscore: prediction.teamAscore,
      teamBscore: prediction. teamBscore,
      teamAPosition: prediction.teamAPosition,
      teamBPosition: prediction.teamBPosition,
      league: prediction.league,
      category: prediction.category,
      leagueIcon: prediction.leagueIcon,
      teamAIcon: prediction.teamAIcon,
      teamBIcon: prediction.teamBIcon,
      betOfTheDay: prediction.betOfTheDay,
      date: prediction.date
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
    const { time, tip, status, formationA, formationB, league, teamAPosition, teamBPosition, category, teamA, teamB, teamAscore, teamBscore, showScore, date } = req.body;
    const vip = req.params.vip;

    try {
      let leagueIcon = prediction.leagueIcon;
      let teamAIcon = prediction.teamAIcon;
      let teamBIcon = prediction.teamBIcon;

      if (req.files['leagueIcon']) {
        const result = await cloudinary.uploader.upload(req.files['leagueIcon'][0].path, {
          width: 500,
          height: 500,
          crop: 'scale',
        });
        leagueIcon = result.secure_url;
      }

      if (req.files['teamAIcon']) {
        const result2 = await cloudinary.uploader.upload(req.files['teamAIcon'][0].path, {
          width: 500,
          height: 500,
          crop: 'scale',
        });
        teamAIcon = result2.secure_url;
      }

      if (req.files['teamBIcon']) {
        const result3 = await cloudinary.uploader.upload(req.files['teamBIcon'][0].path, {
          width: 500,
          height: 500,
          crop: 'scale',
        });
        teamBIcon = result3.secure_url;
      }

      const updatedPrediction = await Admin.findByIdAndUpdate(
        req.params.id,
        {
          time, tip, status, formationA, formationB, teamAPosition, teamBPosition, league, category, teamA, teamB, teamAscore, teamBscore, vip, showScore, date,
          leagueIcon,
          teamAIcon,
          teamBIcon
        },
        { new: true }
      );

      res.status(200).json(updatedPrediction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred when updating the prediction" });
    }
  }
});


const getPrediction = asyncHandler(async (req, res) => {
  try {
    const prediction = await Admin.findById(req.params.id);
    if (!prediction) {
      res.status(400);
      throw new Error("This prediction does not exist");
    }else{
      res.status(200).json(prediction);
    }

  } catch (err) {
    console.log(err);
  }
});




const getVipPredictions = asyncHandler(async (req, res) => {
  try {
    // const date = req.params.date
    const predictions = await Admin.find({ vip: decodeURIComponent(req.params.value), date:req.params.date });
    if (!predictions) {
      res.status(400);
      throw new Error("Prediction not found");
    }else{
      res.status(200).json(predictions);
    }
  
  } catch (err) {
    console.log(err);
  }
});

// const getVipDates = asyncHandler(async (req, res) => {
//   try {
//     const { value } = req.params;
//     const predictions = await Admin.find({ date: value });
    
//     if (!predictions || predictions.length === 0) {
//       res.status(400);
//       throw new Error("Prediction not found");
//     }
    
//     res.status(200).json(predictions);
//   } catch (err) {
//     console.log(err);
//   }
// });



const getFreeTips= asyncHandler(async (req, res) => {
  try {
    const predictions = await Admin.find({freeTip: decodeURIComponent(req.params.value), date:req.params.date})
    if (!predictions) {
      res.status(400);
      throw new Error("Prediction not found");
    } else{
      res.status(200).json(predictions);
    }
  
} catch (err) {
console.log(err);        
}
})
// const getSingleFreetip = asyncHandler(async(req, res) => {
//   try {
//     const predictions = await Admin.find({freeTip: decodeURIComponent(req.params.value), id:req.params.id, date:req.params.date})
//     if (!predictions) {
//       res.status(400);
//       throw new Error("Prediction not found");
//     } else{
//       res.status(200).json(predictions);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// })

const getUpcoming = asyncHandler(async (req, res) => {
  try {
    const predictions = await Admin.find({ upcoming: decodeURIComponent(req.params.value), date:req.params.date });
    if (!predictions) {
      res.status(400);
      throw new Error("Prediction not found");
    }else{  
    res.status(200).json(predictions);
    }
  } catch (err) {
    console.log(err);
  }
});


const getBetOfTheDay = asyncHandler(async (req, res) => {
  try {
    const predictions = await Admin.find({ betOfTheDay: decodeURIComponent(req.params.value), date:req.params.date });
    if (!predictions) {
      res.status(400);
      throw new Error("Prediction not found");
    }else{
      res.status(200).json(predictions);

    }
  
  } catch (err) {
    console.log(err);
  }
});


const getPredictionInCategory = asyncHandler(async (req, res) => {
  const predictions = await Admin.find({ category: decodeURIComponent(req.params.value), date:req.params.date });
  if (!predictions) {
    res.status(400);
    throw new Error("This prediction does not exist");
  }else{
    res.status(200).json(predictions);

  }
});


// const moment = require("moment");

const getPredictions = asyncHandler(async (req, res) => {
  try {
    const predictions = await Admin.find({date:req.params.date,category: { $exists: true }});
    if (!predictions) {
      res.status(400);
      throw new Error("There are no predictions");
    }else{
      res.status(200).json(predictions);

    }

    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred when fetching predictions" });
  }
});


const deletePrediction = asyncHandler(async (req, res) => {
    try {
        const prediction = await Admin.findById(req.params.id)
        if (!prediction) {
            res.status(404);
            throw new Error("Prediction not found");
          }
        await Admin.findByIdAndDelete(req.params.id)
        res.status(200).json({id: req.params.id, message: "Prediction deleted"})
    return;
  } catch (err) {
        console.log(err);
    }
})

module.exports = {
    createPrediction, createVipPrediction, createFreeTip, createBetOfTheDay, createUpcoming, updatePrediction, getPrediction, getBetOfTheDay,getUpcoming, getFreeTips, getVipPredictions, getPredictionInCategory, getPredictions, deletePrediction
}