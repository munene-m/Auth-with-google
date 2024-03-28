const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  createAd,
  getAd,
  getAds,
  deleteAd,
  updateAd,
} = require("../controllers/imageAdController.js");
const { adminProtect } = require("../middleware/authMiddleware.js");

router.route("/create").post(adminProtect, upload.single("image"), createAd);
router.route("/update/:id").put(adminProtect, upload.single("image"), updateAd);
router.route("/:id").get(getAd);
router.route("/").get(getAds);
router.route("/delete/:id").delete(adminProtect, deleteAd);

module.exports = router;
