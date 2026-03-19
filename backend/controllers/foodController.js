const FoodItem = require("../models/foodModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Get All Food Items of a Restaurant
exports.getRestaurantMenu = catchAsyncErrors(async (req, res, next) => {
  const foods = await FoodItem.find({ restaurant: req.params.id });

  res.status(200).json({
    success: true,
    foods,
  });
});

// Create Food Item (Manager/Admin Only)
exports.createFoodItem = catchAsyncErrors(async (req, res, next) => {
  const food = await FoodItem.create(req.body);

  res.status(201).json({
    success: true,
    food,
  });
});

// Update Food Item (Manager/Admin Only)
exports.updateFoodItem = catchAsyncErrors(async (req, res, next) => {
  let food = await FoodItem.findById(req.params.id);

  if (!food) {
    return next(new ErrorHandler("Food item not found", 404));
  }

  food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    food,
  });
});

// Delete Food Item (Manager/Admin Only)
exports.deleteFoodItem = catchAsyncErrors(async (req, res, next) => {
  const food = await FoodItem.findById(req.params.id);

  if (!food) {
    return next(new ErrorHandler("Food item not found", 404));
  }

  await food.deleteOne();

  res.status(200).json({
    success: true,
    message: "Food item deleted successfully",
  });
});
