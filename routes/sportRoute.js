const express = require('express')
const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: 'uploads/'})
const { createPrediction, updatePrediction, getPrediction, getPredictionFromSport, getPredictions, deletePrediction } = require('../controllers/sportController')
const { protect } = require('../middleware/authMiddleware')

router.route("/create/:sport").post(protect, upload.fields([
    { name: 'leagueIcon' },
    { name: 'teamAIcon' },
    { name: 'teamBIcon' },
  ]), createPrediction);
router.route("/update/:id").put(protect, upload.fields([
    { name: 'leagueIcon' },
    { name: 'teamAIcon' },
    { name: 'teamBIcon' },
  ]), updatePrediction)
router.route("/:id").get(getPrediction)
router.route("/").get(getPredictions)
router.route("/sport/:value").get(getPredictionFromSport)
router.route("/delete/:id").delete(protect, deletePrediction)

module.exports = router