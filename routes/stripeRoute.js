const { createCheckout } = require("../controllers/stripeController.js");
const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.route("/create-checkout-session").post(protect, createCheckout);

module.exports = router;
