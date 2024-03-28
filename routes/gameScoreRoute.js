const express = require("express");
const router = express.Router();
const {
  postGameScore,
  updateGameScore,
  getGameScore,
  deleteGameScore,
} = require("../controllers/gameScoreController.js");
const { adminProtect } = require("../middleware/authMiddleware");

router.route("/addScore").post(adminProtect, postGameScore);
router.route("/updateScore/:id").put(adminProtect, updateGameScore);
router.route("/").get(getGameScore);
router.route("/delete/:id").delete(adminProtect, deleteGameScore);

module.exports = router;
