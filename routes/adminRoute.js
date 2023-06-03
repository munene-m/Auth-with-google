const express = require('express')
const router = express.Router()
const multer = require("multer")
const upload = multer({ dest: 'uploads/'})
const { createPrediction, createVipPrediction, createFreeTip, updatePrediction, getPrediction, getPredictions,  getFreeTips, getVipPredictions, getPredictionInCategory, deletePrediction } = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')

router.route("/").get(getPredictions)
router.route("/:id").get(getPrediction)
router.route("/tips/:value").get(getFreeTips)
router.route("/vipPredictions/:value").get(getVipPredictions)
router.route("/create").post(
    protect, upload.fields([
      { name: 'leagueIcon' },
      { name: 'teamAIcon' },
      { name: 'teamBIcon' },
    ]), createPrediction
  );
  router.route("/create/:vip").post(
    protect, upload.fields([
      { name: 'leagueIcon' },
      { name: 'teamAIcon' },
      { name: 'teamBIcon' },
    ]), createVipPrediction
  );

  router.route("/create/tip/:freeTip").post(
    protect, upload.fields([
      { name: 'leagueIcon' },
      { name: 'teamAIcon' },
      { name: 'teamBIcon' },
    ]), createFreeTip
  );
  
router.route("/update/:id").put(protect, upload.fields([
    { name: 'leagueIcon' },
    { name: 'teamAIcon' },
    { name: 'teamBIcon' },
  ]), updatePrediction)
router.route("/delete/:id").delete(protect, deletePrediction)
router.route("/prediction/:value").get(protect, getPredictionInCategory)

module.exports = router