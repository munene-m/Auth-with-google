const express = require('express')
const { loginUser, registerUser, getCredentials, loginWithGoogle, googleAuthCallback, updateUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware")
const router = express.Router();
router.route("/credentials").get(protect,getCredentials)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/update/:id").put(updateUser)
router.route("/auth/google").get(loginWithGoogle)
router.route("/auth/google/callback").get(googleAuthCallback);

module.exports = router

