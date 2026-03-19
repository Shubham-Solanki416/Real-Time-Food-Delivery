const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/orderModel');
const Restaurant = require('./models/restaurantModel');
const FoodItem = require('./models/foodModel');

dotenv.config({ path: './config/config.env' });

const repairOrders = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/food-delivery');
        console.log('Connected to DB');

        const orders = await Order.find();
        const restaurants = await Restaurant.find();
        
        if (restaurants.length === 0) {
            console.log('No restaurants found in DB. Cannot repair.');
            return;
        }

        const defaultRestaurant = restaurants[0];
        console.log(`Using "${defaultRestaurant.name}" as fallback for orphan items.`);

        for (let order of orders) {
            let updated = false;
            for (let item of order.orderItems) {
                // Try to find a food item with the same name to get its current restaurant
                const matchingFood = await FoodItem.findOne({ name: item.name }).populate('restaurant');
                
                if (matchingFood) {
                    item.food = matchingFood._id;
                    item.restaurant = matchingFood.restaurant._id;
                    updated = true;
                } else {
                    // Fallback to first restaurant
                    item.restaurant = defaultRestaurant._id;
                    updated = true;
                }
            }
            if (updated) {
                await order.save({ validateBeforeSave: false });
                console.log(`Repaired Order: ${order._id}`);
            }
        }

        console.log('Database repair complete.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Repair Error:', error);
        process.exit(1);
    }
};

repairOrders();
