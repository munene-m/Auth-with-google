const express = require('express')
const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: 'uploads/'})
const { createAd, getAd, getAds, deleteAd, updateAd } = require('../controllers/imageAdController.js')
const { protect } = require('../middleware/authMiddleware.js')

router.route("/create").post(protect, upload.single("image"), createAd)
router.route("/update/:id").put(protect, upload.single("image"), updateAd)
router.route("/:id").get(getAd)
router.route("/").get(getAds)
router.route("/delete/:id").delete(protect, deleteAd)

module.exports = router