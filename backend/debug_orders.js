const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/orderModel');
const User = require('./models/userModel');
const Restaurant = require('./models/restaurantModel');
const FoodItem = require('./models/foodModel');

dotenv.config({ path: './config/config.env' });

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/food-delivery');
        console.log('Connected to DB');

        const orders = await Order.find()
            .populate({
                path: 'orderItems.restaurant',
                select: 'name'
            });
        
        console.log('Final Check - Orders with Valid Restaurants:', orders.filter(o => o.orderItems?.[0]?.restaurant != null).length);
        if (orders.length > 0) {
            console.log('Order 1 Restaurant:', orders[0].orderItems[0].restaurant?.name);
            console.log('Order 2 Restaurant:', orders[1].orderItems[0].restaurant?.name);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkOrders();
