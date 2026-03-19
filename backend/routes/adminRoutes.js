const express = require("express");
const {
  getDashboardStats,
  getAllRestaurantsAdmin,
  updateRestaurantStatus,
  getAllUsersAdmin,
  getAllOrdersAdmin,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/adminController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/admin/stats")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getDashboardStats);

router
  .route("/admin/restaurants")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllRestaurantsAdmin);

router
  .route("/admin/restaurant/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateRestaurantStatus);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsersAdmin);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrdersAdmin);

router
  .route("/admin/complaints")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllComplaints);

router
  .route("/admin/complaint/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateComplaintStatus);

module.exports = router;
