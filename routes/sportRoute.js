const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  createPrediction,
  updatePrediction,
  getPrediction,
  getAllSports,
  getPredictionFromSport,
  getPredictions,
  deletePrediction,
} = require("../controllers/sportController");
const { getAllPredictions} = require('../controllers/predictionController.js');
const { adminProtect } = require("../middleware/authMiddleware");

router
  .route("/all")
  .get(getAllSports);

router
  .route("/allPredictions")
  .get(getAllPredictions);



router
  .route("/create/:sport")
  .post(
    adminProtect,
    upload.fields([
      { name: "leagueIcon" },
      { name: "teamAIcon" },
      { name: "teamBIcon" },
    ]),
    createPrediction
  );
router
  .route("/update/:id")
  .put(
    adminProtect,
    upload.fields([
      { name: "leagueIcon" },
      { name: "teamAIcon" },
      { name: "teamBIcon" },
    ]),
    updatePrediction
  );
router.route("/single/:date/:teamA/:teamB").get(getPrediction);
router.route("/:date").get(getPredictions);
router.route("/sport/:value/:date").get(getPredictionFromSport);
router.route("/delete/:id").delete(adminProtect, deletePrediction);

module.exports = router;
