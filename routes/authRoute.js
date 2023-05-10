const express = require('express')
const { loginUser, registerUser, loginWithGoogle, googleAuthCallback } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/auth/google", loginWithGoogle);
router.get("/auth/google/callback", googleAuthCallback);

module.exports = router

