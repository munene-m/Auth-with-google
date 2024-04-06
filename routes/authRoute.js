const express = require("express");
const {
  loginUser,
  registerUser,
  registerAdmin,
  getCredentials,
  verifyUser,
  getUsers,
  redirectUser,
  getVipUsers,
  deleteUser,
  loginWithGoogle,
  requestPasswordReset,
  changeUserPassword,
  googleAuthCallback,
  updateUser,
  getUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getUsers);
router.route("/:id").get(protect, getUser);
router.route("/credentials").get(protect, getCredentials);
router.route("/getVip").get(protect, getVipUsers);
router.route("/googleCredentials").get(redirectUser);
router.route("/register").post(registerUser);
router.route("/register-admin").post(registerAdmin);
router.route("/verify/:token").post(verifyUser);
router.route("/login").post(loginUser);
router.route("/update/:id").put(updateUser);
router.route("/request-reset").post(requestPasswordReset);
router.route("/change-password").post(changeUserPassword);
router.route("/auth/google").get(loginWithGoogle);
router.route("/auth/google/callback").get(googleAuthCallback);
router.route("/delete/:id").delete(protect, deleteUser);

module.exports = router;
