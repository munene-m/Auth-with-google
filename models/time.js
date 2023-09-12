const mongoose = require('mongoose')
const timeSchema = new mongoose.Schema({
    time:{
        type: String
    }
}, {timestamps: true})

const Time = mongoose.model("time", timeSchema);
module.exports = Time;