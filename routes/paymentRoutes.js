const express = require("express");
const router = express.Router();
const { adminProtect } = require("../middleware/authMiddleware.js");
const {
  postPrices,
  updatePrice,
  getPrices,
  getPrice,
  deletPrice,
} = require("../controllers/paymentsController.js");

router.route("/create").post(adminProtect, postPrices);
router.route("/update/:id").put(adminProtect, updatePrice);
router.route("/:id").get(getPrice);
router.route("/").get(getPrices);
router.route("/delete/:id").delete(adminProtect, deletPrice);

module.exports = router;
