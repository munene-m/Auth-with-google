const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  createPrediction,
  createVipPrediction,
  createFreeTip,
  createUpcoming,
  createBetOfTheDay,
  updatePrediction,
  getPrediction,
  getBetOfTheDay,
  getUpcoming,
  getPredictions,
  getFreeTips,
  getVipPredictions,
  getPredictionInCategory,
  deletePrediction,
} = require("../controllers/predictionController");
const { adminProtect } = require("../middleware/authMiddleware");
const { checkVipStatus } = require("../middleware/vipMiddleware");

router.route("/:date").get(getPredictions);
router.route("/single/:date/:teamA/:teamB").get(getPrediction);
router.route("/tips/:value/:date").get(getFreeTips);
router
  .route("/vipPredictions/:value/:date")
  .get(checkVipStatus, getVipPredictions);
router.route("/upcomingPredictions/:value/:date").get(getUpcoming);
router.route("/bet/:value/:date").get(getBetOfTheDay);
router
  .route("/create")
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
  .route("/create/:vip")
  .post(
    adminProtect,
    upload.fields([
      { name: "leagueIcon" },
      { name: "teamAIcon" },
      { name: "teamBIcon" },
    ]),
    createVipPrediction
  );

router
  .route("/create/tip/:freeTip")
  .post(
    adminProtect,
    upload.fields([
      { name: "leagueIcon" },
      { name: "teamAIcon" },
      { name: "teamBIcon" },
    ]),
    createFreeTip
  );

router
  .route("/create/upcoming/:upcoming")
  .post(
    adminProtect,
    upload.fields([
      { name: "leagueIcon" },
      { name: "teamAIcon" },
      { name: "teamBIcon" },
    ]),
    createUpcoming
  );

router
  .route("/create/bet/:betOfTheDay")
  .post(
    adminProtect,
    upload.fields([
      { name: "leagueIcon" },
      { name: "teamAIcon" },
      { name: "teamBIcon" },
    ]),
    createBetOfTheDay
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
router.route("/delete/:id").delete(adminProtect, deletePrediction);
router.route("/prediction/:value/:date").get(getPredictionInCategory);

module.exports = router;
