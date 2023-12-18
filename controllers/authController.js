const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { sendVerificationEmail } = require("../helpers/authHelper.js");
require("../passport.js");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const registerUser = async (req, res) => {
  const { username, email, password, country, googleId, paid } = req.body;

  if ((!username || !email || !password || !country) && !googleId) {
    return res.status(400).json({ error: "Please enter all required fields" });
  }

  const userExists = await User.findOne({ email });

  // Check if user account exists in the database
  if (userExists) {
    return res.status(400).json({ error: "User already exists!" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    paid,
    country,
  });

  if (user) {
    try {
      await sendVerificationEmail(user.id, user.email);

      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        paid: user.paid,
        country: user.country,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } catch (verificationError) {
      console.error(verificationError);
      res.status(400).json({ error: verificationError });
    }
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
};

const registerAdmin = async (req, res) => {
  const { username, email, password, country, googleId, paid, isAdmin } =
    req.body;

  if ((!username || !email || !password || !country) && !googleId) {
    return res.status(400).json({ error: "Please enter all required fields" });
  }

  const userExists = await User.findOne({ email });

  // Check if user account exists in the database
  if (userExists) {
    return res.status(400).json({ error: "User already exists!" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    paid,
    country,
    isAdmin: true,
  });

  if (user) {
    await sendVerificationEmail(user.id, user.email);
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      paid: user.paid,
      country: user.country,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
};

//Log in user
const loginUser = async (req, res) => {
  const { email, password, googleId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all required fields" });
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      paid: user.paid,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    return res
      .status(400)
      .json({ error: "The credentials you entered are invalid" });
  }
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "This user does not exist" });
  } else {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Check if the user with userId exists in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user's verification token matches the received token
    if (user.verificationToken !== token) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    // Mark the user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Account successfully verified" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide an email address" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Email does not exist" });
  }
  const userId = user._id;
  const resetToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.passResetToken = resetToken;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "SportyPredict Password Reset",
    html: `
      <p>Hi ${user.username},</p>
      <p>We received a request to change your password. You can click the button below to proceed with creating a new password.</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
      <p style="margin-top: 10px">If you ignore this email, your password will not be changed. This link expires in 1 hour.</p>
      
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to send reset email" });
    }

    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Password reset email sent" });
  });
};

const changeUserPassword = async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) {
    return res
      .status(400)
      .json({ message: "Please enter all the required fields" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    User.findOne({ passResetToken: token })
      .then(async (user) => {
        if (!user) {
          return res.status(400).json({ error: "The token is invalid" });
        }

        // Verify that the token's user ID matches the user's ID
        if (user._id.toString() !== userId) {
          return res.status(401).json({ error: "Invalid token for this user" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        await User.findByIdAndUpdate(
          user._id,
          { password: hashedPassword },
          { new: true }
        );
        user.passResetToken = undefined;
        await user.save();
        res.status(200).json({ message: "Password changed successfully." });
      })
      .catch((error) => {
        res.status(400).json({ error: "Failed to change password", error });
      });
  } catch (err) {
    res.status(400).json({ error: "Failed to change password for user" });
  }
};

// Log in user with Google
const loginWithGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Callback for Google authentication
const googleAuthCallback = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/auth/googleCredentials",
  }),
];

const getCredentials = (req, res) => {
  res.status(200).json(req.user);
};

const getVipUsers = async (req, res) => {
  const vipUsers = await User.find({ paid: true });
  if (!vipUsers) {
    res.status(400).json("Vip users not found");
  } else {
    res.json(vipUsers);
  }
};

const getUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    res.status(400).json("Users not found");
  } else {
    res.json(users);
  }
};
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400).json("User not found");
  } else {
    res.json(user);
  }
};

const redirectUser = async (req, res) => {
  res.status(200).json({ redirectTo: "/" });
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("Prediction not found");
    }
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ id: req.params.id, message: "User account deleted" });
    return;
  } catch (err) {
    console.log(err);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  requestPasswordReset,
  changeUserPassword,
  verifyUser,
  updateUser,
  loginWithGoogle,
  googleAuthCallback,
  getUsers,
  getUser,
  deleteUser,
  getVipUsers,
  getCredentials,
  redirectUser,
};
