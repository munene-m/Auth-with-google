const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  postPrices,
  updatePrice,
  getPrices,
  getPrice,
  deletPrice,
} = require("../controllers/paymentsController.js");

router.route("/create").post(protect, postPrices);
router.route("/update/:id").put(protect, updatePrice);
router.route("/:id").get(protect, getPrice);
router.route("/").get(protect, getPrices);
router.route("/delete/:id").delete(protect, deletPrice);

module.exports = router;
