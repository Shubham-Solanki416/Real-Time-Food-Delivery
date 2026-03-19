const express = require("express");
const { getRestaurantMenu, createFoodItem, updateFoodItem, deleteFoodItem } = require("../controllers/foodController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/restaurant/:id/menu").get(getRestaurantMenu);
router.route("/food/new").post(isAuthenticatedUser, authorizeRoles("manager", "admin"), createFoodItem);
router.route("/food/:id")
  .put(isAuthenticatedUser, authorizeRoles("manager", "admin"), updateFoodItem)
  .delete(isAuthenticatedUser, authorizeRoles("manager", "admin"), deleteFoodItem);

module.exports = router;
