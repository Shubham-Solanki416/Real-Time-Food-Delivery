const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Order = require("../models/orderModel");
const Complaint = require("../models/complaintModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Get Dashboard Stats -- Admin
exports.getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  const usersCount = await User.countDocuments();
  const restaurantsCount = await Restaurant.countDocuments();
  const totalOrders = await Order.countDocuments();

  const orders = await Order.find({ orderStatus: "Delivered" });
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  // Dynamic Revenue Trends based on Range
  const range = req.query.range || "7D";
  let revenueData = [];

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (range === "7D") {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    revenueData = days.map(date => ({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: orders
        .filter(o => new Date(o.createdAt).toDateString() === date.toDateString())
        .reduce((acc, o) => acc + o.totalPrice, 0)
    }));

  } else if (range === "30D") {
    // 4 weeks
    const weeks = [21, 14, 7, 0].map(daysBack => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysBack);
      return d;
    });

    revenueData = weeks.map((date, i) => {
      const start = new Date(date);
      start.setDate(start.getDate() - 6);
      return {
        date: `Week ${i + 1}`,
        revenue: orders
          .filter(o => {
            const od = new Date(o.createdAt);
            return od >= start && od <= date;
          })
          .reduce((acc, o) => acc + o.totalPrice, 0)
      };
    });

  } else if (range === "3M" || range === "1Y") {
    const monthsToShow = range === "3M" ? 3 : 12;
    const months = [...Array(monthsToShow)].map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return d;
    }).reverse();

    revenueData = months.map(date => {
      const monthStr = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      return {
        date: monthsToShow === 12 ? monthStr : `${monthStr} ${year}`,
        revenue: orders
          .filter(o => {
            const od = new Date(o.createdAt);
            return od.getMonth() === date.getMonth() && od.getFullYear() === date.getFullYear();
          })
          .reduce((acc, o) => acc + o.totalPrice, 0)
      };
    });
  }

  res.status(200).json({
    success: true,
    usersCount,
    restaurantsCount,
    totalOrders,
    totalRevenue,
    revenueData,
  });
});

// Get All Restaurants -- Admin
exports.getAllRestaurantsAdmin = catchAsyncErrors(async (req, res, next) => {
  const restaurants = await Restaurant.find().populate("owner", "name email");

  res.status(200).json({
    success: true,
    restaurants,
  });
});

// Update Restaurant Status -- Admin
exports.updateRestaurantStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  restaurant.status = status;
  await restaurant.save();

  res.status(200).json({
    success: true,
    message: `Restaurant status updated to ${status}`,
  });
});

// Get All Users -- Admin
exports.getAllUsersAdmin = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get All Orders -- Admin
exports.getAllOrdersAdmin = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate({
      path: "orderItems.restaurant",
      select: "name"
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Complaints -- Admin
exports.getAllComplaints = catchAsyncErrors(async (req, res, next) => {
  const complaints = await Complaint.find()
    .populate("user", "name email")
    .populate("restaurant", "name")
    .populate("order", "id");

  res.status(200).json({
    success: true,
    complaints,
  });
});

// Update Complaint Status -- Admin
exports.updateComplaintStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return next(new ErrorHandler("Complaint not found", 404));
  }

  complaint.status = status;
  await complaint.save();

  res.status(200).json({
    success: true,
    message: `Complaint status updated to ${status}`,
  });
});
