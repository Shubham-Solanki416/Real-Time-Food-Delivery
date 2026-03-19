const express = require("express");
const { 
    newOrder, 
    getSingleOrder, 
    myOrders, 
    getRestaurantOrders, 
    updateOrderStatus 
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// Manager Routes
router.route("/restaurant/:restaurantId/orders").get(isAuthenticatedUser, authorizeRoles("manager", "admin"), getRestaurantOrders);
router.route("/order/:id/status").put(isAuthenticatedUser, authorizeRoles("manager", "admin"), updateOrderStatus);

module.exports = router;
