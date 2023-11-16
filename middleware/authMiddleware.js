const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } else {
    return res.status(401).json({ error: "Unauthorized attempt" });
  }
  if (!token) {
    return res.status(401).json({ error: "No authorization without token" });
  }
};

module.exports = { protect };
