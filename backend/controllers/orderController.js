const FoodItem = require("../models/foodModel");
const Restaurant = require("../models/restaurantModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    deliveryPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    deliveryPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });

  // Create Notification for customer
  const notification = await Notification.create({
    user: req.user._id,
    message: `Order #${order._id.toString().slice(-6)} placed successfully! 🎉`,
    order: order._id,
  });

  // Real-time notification for customer
  const io = req.app.get("socketio");
  if (io) {
    io.emit(`newNotification-${req.user._id}`, notification);
  }
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: 'orderItems.restaurant',
      select: 'name location'
    });

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged In User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders of a Restaurant (Manager Only)
exports.getRestaurantOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ "orderItems.restaurant": req.params.restaurantId });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Update Order Status (Manager Only)
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  // Real-time update via Socket.IO would be triggered here
  const io = req.app.get("socketio");
  
  // Create Notification message based on status
  let message = "";
  switch (req.body.status) {
    case "Preparing":
      message = `Kitchen is preparing your order #${order._id.toString().slice(-6)}.`;
      break;
    case "Out for Delivery":
      message = `Order #${order._id.toString().slice(-6)} is out for delivery! 🚴`;
      break;
    case "Delivered":
      message = `Order #${order._id.toString().slice(-6)} delivered. Enjoy! ✅`;
      break;
    default:
      message = `Your order #${order._id.toString().slice(-6)} status: ${req.body.status}`;
  }

  // Create Notification in DB
  const notification = await Notification.create({
    user: order.user,
    message,
    order: order._id,
  });

  if (io) {
    // Existing order status update event
    io.emit(`orderUpdate-${order._id}`, { status: order.orderStatus });
    
    // New notification event for customer
    io.emit(`newNotification-${order.user}`, notification);
  }

  res.status(200).json({
    success: true,
    order,
  });
});
