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
        type: String,
        required: true
    },
    position: {
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