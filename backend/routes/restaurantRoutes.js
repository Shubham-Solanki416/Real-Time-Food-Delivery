const express = require("express");
const {
  getAllRestaurants,
  createRestaurant,
  getRestaurantDetails,
  createRestaurantReview,
  getMyRestaurant,
  getRestaurantAnalytics,
} = require("../controllers/restaurantController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/restaurants").get(getAllRestaurants);

router
  .route("/review")
  .put(isAuthenticatedUser, createRestaurantReview);

router
  .route("/admin/restaurant/new")
  .post(isAuthenticatedUser, authorizeRoles("admin", "manager"), createRestaurant);

router.route("/restaurant/:id").get(getRestaurantDetails);
router.route("/manager/my-restaurant").get(isAuthenticatedUser, authorizeRoles("manager"), getMyRestaurant);
router.route("/manager/analytics").get(isAuthenticatedUser, authorizeRoles("manager"), getRestaurantAnalytics);

module.exports = router;
