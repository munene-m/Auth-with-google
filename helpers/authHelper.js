const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (userId, userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      const verificationToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      user.verificationToken = verificationToken;
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: "SportyPredict Account Verification",
        html: `
          <p>Click the button below to verify your SportyPredict account email.</p>
          <a href="${process.env.CLIENT_URL}/verify-user/${verificationToken}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
          <p>This link expires in 1 hour.</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          reject("Failed to send account verification email");
        } else {
          console.log("Email sent: " + info.response);
          resolve("Account verification email sent");
        }
      });
    } catch (err) {
      console.log(err);
      reject("Failed to send account verification email");
    }
  });
};

module.exports = { sendVerificationEmail };
