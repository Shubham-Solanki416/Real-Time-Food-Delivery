const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Food Delivery Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer",
  });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  if (req.body.avatar && req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    // Destroy old avatar if exists
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Delete Profile
exports.deleteProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.avatar && user.avatar.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  }

  await user.deleteOne();

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Deleted Successfully",
  });
});

// Add Address
exports.addAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.addresses.push(req.body);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

// Update Address
exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  const addressIndex = user.addresses.findIndex(
    (addr) => addr._id.toString() === req.params.id
  );

  if (addressIndex === -1) {
    return next(new ErrorHandler("Address not found", 404));
  }

  user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...req.body };
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

// Delete Address
exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.id
  );

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    addresses: user.addresses,
  });
});

// Toggle Favorite Restaurant
exports.toggleFavoriteRestaurant = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const restaurantId = req.params.restaurantId;

  const isFavorite = user.favoriteRestaurants.includes(restaurantId);

  if (isFavorite) {
    user.favoriteRestaurants = user.favoriteRestaurants.filter(
      (id) => id.toString() !== restaurantId.toString()
    );
  } else {
    user.favoriteRestaurants.push(restaurantId);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    favoriteRestaurants: user.favoriteRestaurants,
  });
});

