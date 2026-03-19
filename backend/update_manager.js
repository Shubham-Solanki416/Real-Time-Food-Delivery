const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/restaurantModel');

dotenv.config({ path: './config/config.env' });

const updateManager = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/food-delivery');
        console.log('Connected to DB');

        const userId = '69b2377ebbef36d401be2b29';
        const restaurantId = '69b4df8d2f57d84384cabdb4';

        const restaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { owner: userId },
            { new: true }
        );

        console.log('Update Successful:', restaurant.name, 'is now managed by User ID:', restaurant.owner);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateManager();
