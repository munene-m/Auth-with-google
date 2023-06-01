const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } else {
    res.status(401);
    throw new Error("Unauthorized attempt");
  }
  if (!token) {
    res.status(401);
    throw new Error("No authorization without token");
  }
});

const googleProtect = (req, res, next) => {
  if (req.session.user) {
    // User session exists, proceed to the next middleware
    next();
  } else {
    // User session doesn't exist, send 401 Unauthorized response
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { protect, googleProtect }
