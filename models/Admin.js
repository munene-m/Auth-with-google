const mongoose = require("mongoose")
const adminSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    tip: {
        type: Number,
        required: true
    },
    match: {
        type: Array,
        required: true
    },
    teamA: {
        type: String
    },
    teamAscore: {
        type: String,
    },
    teamBscore: {
        type: String,
    },   
    teamB: {
        type: String,
    },
    
    teamAIcon: {
        type: String,
        required: true
    },
    teamBIcon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    league: {
        type: String,
        required: true
    },
    leagueIcon: {
        type: String,
        required: true
    },
    formation: {
        type: String,
        required: true
    }
},{timestamps: true})

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;