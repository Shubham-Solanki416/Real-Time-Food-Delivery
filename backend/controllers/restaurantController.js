const Restaurant = require("../models/restaurantModel");
const Order = require("../models/orderModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

// ... existing code ...

// Create or Update Restaurant Review
exports.createRestaurantReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, restaurantId, orderId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    order: orderId,
  };

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  // Check if order belongs to user and is delivered
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to rate this order", 401));
  }

  if (order.orderStatus !== "Delivered") {
    return next(new ErrorHandler("You can only rate delivered orders", 400));
  }

  if (order.isRated) {
    return next(new ErrorHandler("You have already rated this order", 400));
  }

  // Since we check order.isRated, we don't need to check if user already reviewed this order in restaurant.reviews
  // But for safety against multiple orders, we should probably check restaurant.reviews if we wanted to allow only one review per user per restaurant
  // However, the request says "Restaurant average rating updates" after popup, so one review per order seems correct.

  restaurant.reviews.push(review);
  restaurant.numOfReviews = restaurant.reviews.length;

  restaurant.ratings =
    restaurant.reviews.reduce((acc, item) => item.rating + acc, 0) /
    restaurant.reviews.length;

  await restaurant.save({ validateBeforeSave: false });

  // Mark order as rated
  order.isRated = true;
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get Restaurant Analytics -- Manager
exports.getRestaurantAnalytics = catchAsyncErrors(async (req, res, next) => {
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  const orders = await Order.find({
    "orderItems.restaurant": restaurant._id,
    orderStatus: "Delivered",
  });

  // Dynamic Revenue Trends
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

  // Calculate Popular Items
  const itemCounts = {};
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      if (item.restaurant.toString() === restaurant._id.toString()) {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      }
    });
  });

  const popularItems = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.status(200).json({
    success: true,
    revenueData,
    popularItems,
    totalRevenue,
    totalOrders: orders.length,
  });
});

// Create Restaurant (For Admin/Manual setup)
exports.createRestaurant = catchAsyncErrors(async (req, res, next) => {
  req.body.owner = req.user.id;
  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    success: true,
    restaurant,
  });
});

// Get All Restaurants (With Search & Filter)
exports.getAllRestaurants = catchAsyncErrors(async (req, res, next) => {
  console.log("Incoming Query Params:", req.query);

  const resultPerPage = 8;
  const restaurantsCount = await Restaurant.countDocuments();

  const apiFeature = new APIFeatures(Restaurant.find({ status: "approved" }), req.query)
    .search()
    .filter();

  // Get filtered count before pagination
  const filteredQuery = apiFeature.query.clone();
  const filteredRestaurants = await filteredQuery;
  const filteredRestaurantsCount = filteredRestaurants.length;

  // Apply pagination
  apiFeature.pagination(resultPerPage);
  const restaurants = await apiFeature.query;

  console.log(`Found ${restaurants.length} restaurants out of ${filteredRestaurantsCount} filtered.`);

  res.status(200).json({
    success: true,
    restaurants,
    restaurantsCount,
    resultPerPage,
    filteredRestaurantsCount,
  });
});

// Get Single Restaurant Details
exports.getRestaurantDetails = catchAsyncErrors(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  res.status(200).json({
    success: true,
    restaurant,
  });
});

// Get Manager's Restaurant
exports.getMyRestaurant = catchAsyncErrors(async (req, res, next) => {
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found for this manager", 404));
  }

  res.status(200).json({
    success: true,
    restaurant,
  });
});
