const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Restaurant = require('./models/restaurantModel');

dotenv.config({ path: './config/config.env' });

const findEntities = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/food-delivery');
        console.log('Connected to DB');

        const user = await User.findOne({ name: /Janakbhai Solanki/i });
        const restaurant = await Restaurant.findOne({ name: /Haldiram/i });

        console.log('User Found:', user ? { id: user._id, name: user.name, role: user.role } : 'NOT FOUND');
        console.log('Restaurant Found:', restaurant ? { id: restaurant._id, name: restaurant.name, owner: restaurant.owner } : 'NOT FOUND');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

findEntities();
