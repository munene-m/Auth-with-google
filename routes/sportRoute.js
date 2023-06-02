const express = require('express')
const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: 'uploads/'})
const { createPrediction, updatePrediction, getPrediction, getPredictions, deletePrediction } = require('../controllers/sportController')
const { protect } = require('../middleware/authMiddleware')

router.route("/create").post(protect, upload.fields([{ name: 'playerALogo' },{ name: 'playerBLogo' }]), createPrediction);
router.route("/update/:id").put(protect, upload.fields([{ name: 'playerALogo' },{ name: 'playerBLogo' }]), updatePrediction)
router.route("/:id").get(protect, getPrediction)
router.route("/").get(protect, getPredictions)
router.route("/delete/:id").delete(protect, deletePrediction)

module.exports = router