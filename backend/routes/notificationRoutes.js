const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteAllNotifications,
  deleteNotification,
} = require("../controllers/notificationController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/notifications").get(isAuthenticatedUser, getNotifications).delete(isAuthenticatedUser, deleteAllNotifications);
router.route("/notifications/mark-read").put(isAuthenticatedUser, markAllAsRead);
router.route("/notification/:id").put(isAuthenticatedUser, markAsRead).delete(isAuthenticatedUser, deleteNotification);

module.exports = router;
