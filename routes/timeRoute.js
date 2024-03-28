const express = require("express");
const router = express.Router();
const {
  postTime,
  getTime,
  updateTime,
  deleteTime,
} = require("../controllers/timeController");
const { adminProtect } = require("../middleware/authMiddleware");
router.route("/post").post(adminProtect, postTime);
router.route;
router.route("/").get(getTime);
router.route("/update/:id").put(adminProtect, updateTime);
router.route("/delete/:id").delete(adminProtect, deleteTime);

module.exports = router;
