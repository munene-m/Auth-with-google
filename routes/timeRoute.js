const express = require('express')
const router = express.Router()
const { postTime, getTime, updateTime, deleteTime } = require("../controllers/timeController")
const { protect } = require("../middleware/authMiddleware")
router.route("/post").post(protect,postTime)
router.route("/").get(getTime)
router.route("/update/:id").put(protect,updateTime)
router.route("/delete/:id").delete(protect,deleteTime)


module.exports = router