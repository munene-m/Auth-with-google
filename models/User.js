const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  googleId: {
    type: String,
    // unique: true,
  },
  googleEmail: {
    type: String,
    // unique: true,
  },
  googleDisplayName: {
    type: String,
  },
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("UserGoogle", userSchema);

module.exports = User;
