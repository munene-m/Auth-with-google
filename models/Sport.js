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
  playerALeague: {
    type: String,
    required: true
  },
  playerATime: {
    type: String,
    required: true
  },
  playerB: {
    type: String,
    required: true,
  },
  playerBLogo: {
    type: String,
    // required: true,
  },
  playerBLeague: {
    type: String,
    required: true
  },
  playerBTime: {
    type: String,
    required: true
  },
  gamePrediction: {
    type: String,
    required: true
  },
  sport: {
    type:String
  }
});


const Sport = mongoose.model("Sport", sportSchema);

module.exports = Sport;
