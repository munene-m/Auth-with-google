const express = require('express')
const router = express.Router()
const { postGameScore, updateGameScore, getGameScore, deleteGameScore } = require("../controllers/gameScoreController.js")
const { protect } = require('../middleware/authMiddleware')

router.route("/addScore").post(protect, postGameScore)
router.route("/updateScore/:id").put(protect, updateGameScore)
router.route("/").get(getGameScore)
router.route("/delete/:id").delete(protect, deleteGameScore)

module.exports = router