const Notification = require("../models/notificationModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Get all notifications of logged in user
exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    notifications,
  });
});

// Mark notification as read
exports.markAsRead = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
  });
});

// Mark all notifications as read
exports.markAllAsRead = catchAsyncErrors(async (req, res, next) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });

  res.status(200).json({
    success: true,
  });
});

// Delete all notifications
exports.deleteAllNotifications = catchAsyncErrors(async (req, res, next) => {
  await Notification.deleteMany({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: "All notifications deleted",
  });
});

// Delete specific notification
exports.deleteNotification = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});
