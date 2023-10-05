const mongoose = require("mongoose")
const gameScoreSchema = new mongoose.Schema({
    gameName:{
        type: String
    },
    gameScore:{
        type: Boolean,
        default: false
    }
}, {timestamps:true})

const gameScore = mongoose.model("gameScore", gameScoreSchema)
module.exports = gameScore