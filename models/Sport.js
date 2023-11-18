const mongoose = require("mongoose");
const sportSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
    },
    status: {
      type: String,
    },
    teamA: {
      type: String,
      required: true,
    },
    teamAscore: {
      type: Number,
    },
    teamBscore: {
      type: Number,
    },
    teamB: {
      type: String,
    },
    teamAPosition: {
      type: String,
    },
    teamBPosition: {
      type: String,
    },

    teamAIcon: {
      type: String,
      required: true,
    },
    teamBIcon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    league: {
      type: String,
    },
    leagueIcon: {
      type: String,
      required: true,
    },
    formationA: {
      type: Array,
      required: true,
    },
    formationB: {
      type: Array,
      required: true,
    },
    sport: {
      type: String,
    },
    showScore: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Sport = mongoose.model("Sport", sportSchema);

module.exports = Sport;
