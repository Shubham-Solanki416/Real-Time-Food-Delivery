const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  },
  subject: {
    type: String,
    required: [true, "Please enter complaint subject"],
  },
  description: {
    type: String,
    required: [true, "Please enter complaint description"],
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);
