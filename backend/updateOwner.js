const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Restaurant = require("./models/restaurantModel");

dotenv.config({ path: "config/config.env" });

const updateOwner = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB");

    const restaurantId = "69abfdb05836416d1b2fb4a3";
    const managerId = "69ad4a32e4e4a681a8a4ead0";

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { owner: managerId },
      { new: true }
    );

    if (updatedRestaurant) {
      console.log(`Successfully updated owner of ${updatedRestaurant.name} to ${managerId}`);
    } else {
      console.log("Restaurant not found");
    }

    process.exit();
  } catch (error) {
    console.error("Error updating owner:", error.message);
    process.exit(1);
  }
};

updateOwner();
