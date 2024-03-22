const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
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
    vip: {
      type: String,
      trim: true,
    },
    freeTip: {
      type: String,
      trim: true,
    },
    upcoming: {
      type: String,
      trim: true,
    },
    betOfTheDay: {
      type: String,
      trim: true,
    },
    showScore: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      // default: Date.now()
    },
    description: {
      type: String,
    },
    statistics: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
