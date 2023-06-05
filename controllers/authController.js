const User = require('../models/User');
const jwt = require("jsonwebtoken")
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')
const passport = require('passport')
const {protect} = require('../middleware/authMiddleware')
require('../passport.js')
 
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword, country, googleId, paid } = req.body;

  if ((!username || !email || !password || !confirmPassword || !country) && !googleId)  {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const userExists = await User.findOne({ email });

  // Check if user account exists in the database
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    paid,
    country
  });

  if (user) {
    res.status(201);
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      paid: user.paid,
      country: user.country,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});


  const registerAdmin = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword, country, googleId, paid, isAdmin } = req.body;
  
    if ((!username || !email || !password || !confirmPassword || !country) && !googleId)  {
      res.status(400);
      throw new Error("Please enter all the required fields");
    }
  
    const userExists = await User.findOne({ email });
  
    // Check if user account exists in the database
    if (userExists) {
      res.status(400);
      throw new Error("User already exists!");
    }
  
    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      paid,
      country,
      isAdmin: true
    });
  
    if (user) {
      res.status(201);
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        paid: user.paid,
        country: user.country,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  });
  
  
  //Log in user
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password, googleId } = req.body;
  
    if ((!email || !password) && !googleId) {
      res.status(400);
      throw new Error("Please enter all the required fields");
    } 
    let user
    if(googleId){
        user = await User.findOne({ googleId });
        if(!user) {
            user = await User.create({
                email, googleId
            })
        }
    } else {
        user = await User.findOne({ email })
        if(!user || !(bcrypt.compare(password, user.password))){
            res.status(400)
            throw new Error("The credentials you entered are invalid");
        }        
    }
    res.status(200).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        paid: user.paid,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
  });

  const updateUser = asyncHandler( async( req, res ) => {
    const user = await User.findById(req.params.id);
  
    if(!user) {
        res.status(404);
        throw new Error("User does not exist");
    }else{
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedUser);
    }
  
  });

  const reset = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User does not exist');
    }
      // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password
  user.password = hashedPassword;
  const updatedUser = await user.save();


  // Exclude the password field from the response
  const userWithoutPassword = await User.findById(updatedUser._id).select('-password');

  res.status(200).json(userWithoutPassword);
  })

  // Log in user with Google
 const loginWithGoogle = passport.authenticate("google", {
    scope: ["profile", "email"],
  });
  
  // Callback for Google authentication
 const googleAuthCallback = [ passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/auth/googleCredentials",
  })]

  const getCredentials = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
  });

  const getVipUsers = asyncHandler(async (req, res) => {
    const vipUsers = await User.find({paid: true})
    if(!vipUsers){
      res.status(400).json("Vip users not found")
    } else {
      res.json(vipUsers)
    }
  })

  const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
    if(!users){
      res.status(400).json("Users not found")
    } else {
      res.json(users)
    }
  })

  const redirectUser = asyncHandler(async (req, res) => {
    res.status(200).json({ redirectTo: '/' })
  });
  
  
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };

  module.exports = { registerUser, registerAdmin, loginUser, updateUser, reset, loginWithGoogle, googleAuthCallback, getUsers, getVipUsers,getCredentials, redirectUser }