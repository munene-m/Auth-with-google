const express = require('express')
const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: 'uploads/'})
const { createPrediction, updatePrediction, getPrediction, getPredictions, getPredictionInCategory, deletePrediction } = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')

router.route("/").get(getPredictions)
router.route("/:id").get(getPrediction)
router.route("/create").post(
    protect, upload.fields([
      { name: 'leagueIcon' },
      { name: 'teamAIcon' },
      { name: 'teamBIcon' },
    ]), createPrediction
  );
  
router.route("/update/:id").put(protect, upload.fields([
    { name: 'leagueIcon' },
    { name: 'teamAIcon' },
    { name: 'teamBIcon' },
  ]), updatePrediction)
router.route("/delete/:id").delete(protect, deletePrediction)
router.route("/prediction/:value").get(protect, getPredictionInCategory)

module.exports = router