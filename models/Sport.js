const mongoose = require("mongoose");
const sportSchema = new mongoose.Schema({
  playerA: {
    type: String,
    required: true,
  },
  playerALogo: {
    type: String,
    // required: true,
  },
  playerB: {
    type: String,
    required: true,
  },
  playerBLogo: {
    type: String,
    // required: true,
  },
  league: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  gamePrediction: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    trim: true
  }
});


const Sport = mongoose.model("Sport", sportSchema);

module.exports = Sport;
