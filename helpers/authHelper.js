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

const sendNewsletter = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Elevate Your Experience: Subscribe to VIP Predictions Now!",
    html: `
    <h2 style="padding-bottom: 10px">Hello ${username},</h2>
    <h3>Welcome to Sportypredict</h3>
    <p style="padding-bottom: 10px">We hope this message finds you well and enjoying the excitement of the sports world! At <a href="http://www.sportypredict.com" target="_blank">Sportypredict.com</a>, we're dedicated to enhancing your experience, and we have something special just for you.</p>
    <h3 style="padding-bottom: 10px"> 🌟 Unlock Exclusive VIP Predictions: </h3>
    <p style="padding-bottom: 10px">Are you ready to take your sports predictions to the next level? Our VIP Predictions offer an exclusive insight into upcoming matches, expert analyses, and winning strategies that you won't find anywhere else.</p>
    <p style="padding-bottom: 10px">By subscribing to our VIP Predictions, you'll enjoy:</p>

    <p style="display:flex; flex-wrap: wrap; align-items: center; padding-bottom: 6px"> <b> ✅ Spot-on Predictions:</b> Our experts use advanced algorithms and in-depth analysis to provide predictions with a high accuracy rate.</p>
    <p style="display:flex; flex-wrap: wrap; align-items: center; padding-bottom: 6px"> <b> ✅ Diverse Sports Coverage:</b>Diverse Sports Coverage: From football thrillers to basketball showdowns and tennis epics, our VIP Predictions cover a wide range of sports.</p>
    <p style="display:flex; flex-wrap: wrap; align-items: center; padding-bottom: 6px"> <b> ✅ Early Access:</b>Get the predictions before the rest! VIP subscribers receive early access to our insights, giving you a strategic advantage.</p>
    <p style="display:flex; flex-wrap: wrap; align-items: center; padding-bottom: 6px"> <b> ✅ Member-Only Content:</b>Enjoy exclusive articles, in-depth analyses, and behind-the-scenes content curated just for our VIP community.</p>

    <h3 style="padding-bottom: 6px"> 🔒 How to subscribe</h3>

    <p style="padding-bottom: 8px">Subscribing is quick and easy! Simply click <a href="https://sportypredict.com/how-to-pay" target="_blank">Subscribe Now</a> or visit our website's <a href="https://sportypredict.com/vip" target="_blank">VIP section</a>, and elevate your sports prediction game.</p>

    <p style="padding-bottom: 8px">But that's not all! Subscribers who join today will receive an exclusive [ Special Offer/Bonus/Discount ] as a token of our appreciation.</p>

    <p style="padding-bottom: 20px">Thank you for being a valued member of the <a href="https://sportypredict.com/" target="_blank">SportyPredict</a> community. We look forward to delivering top-notch predictions</p>

    <p style="padding-botom: 10px">Best regards,</p>

    <div style="padding-botom: 2em">
        <p>VIP Team</p>
        <p>At SportyPredict</p>
        <p><a href="http://www.sportypredict.com" target="_blank">www.sportypredict.com</a></p>
        <p>+254703147237</p>
    </div>    
  

  <table style="margin-left: auto; margin-right: auto; margin-top: 4em">
    <tr>
      <td>
      <a href="https://t.me/sportypredict_tips" target="_blank"><img width="28" height="28" src="https://img.icons8.com/452/telegram-app--v3.png" alt="telegram icon"></a>
      <a href="https://www.tiktok.com/@sportypredict?_t=8dxjShAnRI5&_r=1" target="_blank"><img width="28" height="28" src="https://img.icons8.com/452/tiktok.png" alt="tiktok icon"></a>
      <a href="https://www.youtube.com/@Sportypredict" target="_blank"><img width="28" height="28" src="https://img.icons8.com/452/youtube-play.png" alt="youtube icon"></a>
      <a href="https://wa.me/+254703147237?text=Hi" target="_blank"><img width="28" height="28" src="https://img.icons8.com/452/whatsapp.png" alt="whatsapp icon"></a>
      <a href="https://www.facebook.com/profile.php?id=100093225097104&mibextid=LQQJ4d" target="_blank"><img width="28" height="28" src="https://img.icons8.com/452/facebook.png" alt="facebook icon"></a>
      <a href="https://www.instagram.com/sportypredict_" target="_blank"><img width="28" height="28" src="https://img.icons8.com/452/instagram-new--v2.png" alt="instagram icon"></a>
      <a href="https://twitter.com/sportypredict" target="_blank"><img width="28" height="28" src="https://img.icons8.com/452/twitterx.png" alt="twitter icon"></a>   
      </td>
    </tr>
  </table> 
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

module.exports = { sendVerificationEmail, sendNewsletter };
