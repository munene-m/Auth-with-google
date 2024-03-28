const { createCheckout } = require("../controllers/stripeController.js");
const express = require("express");
const router = express.Router();

router.route("/create-checkout-session").post(createCheckout);

module.exports = router;
