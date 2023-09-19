const mongoose = require('mongoose')
const adSchema = new mongoose.Schema({
    image:{
        type: String
    },
    title:{
        type: String
    },
    description:{
        type: String
    }
}, {timestamps: true})

const imageAd = mongoose.model("ad", adSchema);
module.exports = imageAd;
