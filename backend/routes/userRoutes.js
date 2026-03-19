const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateProfile,
  updatePassword,
  deleteProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleFavoriteRestaurant,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails); // Added new route
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/delete").delete(isAuthenticatedUser, deleteProfile);

router.route("/me/address").post(isAuthenticatedUser, addAddress);
router.route("/me/address/:id").put(isAuthenticatedUser, updateAddress).delete(isAuthenticatedUser, deleteAddress);

router.route("/me/favorites/:restaurantId").put(isAuthenticatedUser, toggleFavoriteRestaurant);

module.exports = router;
