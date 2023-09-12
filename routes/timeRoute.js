const express = require('express')
const router = express.Router()
const { postTime, getTime } = require("../controllers/timeController")
const { protect } = require("../middleware/authMiddleware")
router.route("/post").post(protect,postTime)
router.route("/").get(getTime)

module.exports = router