const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require('path');
const fs = require('fs');

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

      const client = userEmail.split('@')[0];
      const verificationPath = path.join(__dirname, '/client/verificationEmail.html');
      const verificationTemplate = fs.readFileSync(verificationPath, 'utf-8');
      const linkUrl =   `${process.env.CLIENT_URL}`;
      const verificationT =   `${verificationToken}`;
      const personalizedTemplate = verificationTemplate.replace('{{client}}', client).replace('{{linkUrl}}', linkUrl).replace('{{verification}}', verificationT);
     
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: "SportyPredict Account Verification",
        html: personalizedTemplate,
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

const sendNewsletter = async (email, username) => {
  const newsletterPath = path.join(__dirname, '/client/newsletter.html');
  const newsletterTemplate = fs.readFileSync(newsletterPath, 'utf-8');
  const personalizedTemplate = newsletterTemplate.replace('{{username}}', username);
 
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Elevate Your Experience: Subscribe to VIP Predictions Now!",
    html: personalizedTemplate,
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

module.exports = { sendVerificationEmail, sendNewsletter };
