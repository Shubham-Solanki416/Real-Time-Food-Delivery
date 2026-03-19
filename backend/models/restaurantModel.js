const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter restaurant name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter restaurant description"],
  },
  cuisine: [String],
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      order: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter restaurant category"],
  },
  deliveryTime: {
    type: Number,
    required: [true, "Please enter estimated delivery time"],
  },
  avgPrice: {
    type: Number,
    required: [true, "Please enter average price"],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: [true, "Please specify restaurant status"],
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
