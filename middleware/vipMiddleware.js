const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const checkVipStatus = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      const activationDate = new Date(user?.activationDate);
      const currentDate = new Date();
      const timeDiff = Math.abs(
        currentDate.getTime() - activationDate.getTime()
      );
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (diffDays > user?.days) {
        return res.status(401).json({
          error: "Subscription is over. Please renew your subscription.",
        });
      }

      next();
    } catch (err) {
      if (err.name == "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "Login session expired. Please login again." });
      } else {
        console.log(err);
        return res.status(401).json({ error: "Invalid token" });
      }
    }
  } else {
    return res.status(401).json({ error: "No authorization token provided" });
  }
};

module.exports = { checkVipStatus };
