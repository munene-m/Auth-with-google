const express = require('express')
const router = express.Router()
const { createPrediction, updatePrediction, getPrediction, getPredictions, deletePrediction } = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')

router.route("/").get(getPredictions)
router.route("/:id").get(getPrediction)
router.route("/create").post(protect,createPrediction)
router.route("/update/:id").put(protect, updatePrediction)
router.route("/delete/:id").delete(protect, deletePrediction)

module.exports = router