const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Restaurant = require("./models/restaurantModel");
const FoodItem = require("./models/foodModel");

dotenv.config({ path: "config/config.env" });

const restaurantData = [
  {
    name: "Haldiram's",
    description: "Famous Indian vegetarian restaurant chain known for snacks and sweets.",
    cuisine: ["Indian", "Snacks"],
    ratings: 4.6,
    numOfReviews: 1800,
    images: [{ public_id: "haldirams", url: "https://www.hotelierindia.com/cloud/2022/05/11/bHMCvgQr-W3EEU5qM-1200x661.jpeg" }],
    category: "Indian",
    deliveryTime: 30,
    avgPrice: 250,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  },

  {
    name: "Bikanervala",
    description: "Traditional Indian sweets and street food restaurant.",
    cuisine: ["Indian", "Street Food"],
    ratings: 4.5,
    numOfReviews: 1500,
    images: [{ public_id: "bikanervala", url: "https://cdn.shopify.com/s/files/1/0774/9769/6567/files/prahlad_nagar_c7ec75e1-f0df-4cc5-b140-cc5e521435ac_480x480.png?v=1718108180" }],
    category: "Indian",
    deliveryTime: 30,
    avgPrice: 220,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  },

  {
    name: "Saravana Bhavan",
    description: "Authentic South Indian vegetarian cuisine.",
    cuisine: ["South Indian"],
    ratings: 4.7,
    numOfReviews: 2100,
    images: [{ public_id: "sb", url: "https://content.jdmagicbox.com/comp/thrissur/a5/9999px487.x487.180905030449.m4a5/catalogue/sri-mu-saravana-bhavan-koratti-south-thrissur-restaurants-3wzt3bp03s.jpg" }],
    category: "South Indian",
    deliveryTime: 25,
    avgPrice: 200,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  },

  {
    name: "Barbeque Nation",
    description: "Popular restaurant famous for grilled vegetarian dishes.",
    cuisine: ["North Indian", "BBQ"],
    ratings: 4.4,
    numOfReviews: 3000,
    images: [{ public_id: "bbq", url: "https://content.jdmagicbox.com/v2/comp/howrah/q6/9999pxx33.xx33.230406181904.v7q6/catalogue/ubq-by-barbeque-nation-kadamtala-howrah-restaurants-2aqr77mock.jpg" }],
    category: "North Indian",
    deliveryTime: 40,
    avgPrice: 450,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  },

  {
    name: "Wow! Momo",
    description: "Popular fast food chain famous for momos.",
    cuisine: ["Asian", "Fast Food"],
    ratings: 4.3,
    numOfReviews: 1700,
    images: [{ public_id: "momo", url: "https://dtbtob4osa700.cloudfront.net/DineImages/15022020055738302_dprim.png" }],
    category: "Fast Food",
    deliveryTime: 20,
    avgPrice: 180,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  },

  {
    name: "Biryani By Kilo",
    description: "Premium restaurant known for dum cooked vegetarian biryani.",
    cuisine: ["Biryani", "Indian"],
    ratings: 4.5,
    numOfReviews: 1600,
    images: [{ public_id: "bbk", url: "https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2020-12/Biryani%20by%20Kilo.jpg" }],
    category: "Biryani",
    deliveryTime: 35,
    avgPrice: 350,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  },

  {
    name: "Cafe Coffee Day",
    description: "Popular Indian cafe chain serving coffee and snacks.",
    cuisine: ["Cafe"],
    ratings: 4.2,
    numOfReviews: 1900,
    images: [{ public_id: "ccd", url: "https://dtbtob4osa700.cloudfront.net/DineImages/08052020072237894_dprim.png" }],
    category: "Cafe",
    deliveryTime: 15,
    avgPrice: 180,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  },

  {
    name: "Goli Vada Pav",
    description: "Street food chain famous for vada pav.",
    cuisine: ["Street Food"],
    ratings: 4.1,
    numOfReviews: 1200,
    images: [{ public_id: "goli", url: "https://media-cdn.tripadvisor.com/media/photo-s/18/46/18/3b/goli-vada-pav-no-1.jpg" }],
    category: "Street Food",
    deliveryTime: 15,
    avgPrice: 120,
    owner: "65e8a7d1e4b0a1a1a1a1a1a1",
    status: "approved"
  }
];

const foodItems = [
  {
    restaurantName: "Haldiram's",
    items: [
      { name: "Chole Bhature", description: "Punjabi chickpea curry with fried bhature.", price: 180, category: "Main Course", isVeg: true, images: [{ public_id: "f1", url: "https://images.unsplash.com/photo-1626132647523-66d2f2a444ef?w=400" }] },
      { name: "Raj Kachori", description: "Crispy kachori filled with chutneys.", price: 150, category: "Snacks", isVeg: true, images: [{ public_id: "f2", url: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400" }] },
      { name: "Pav Bhaji", description: "Spiced mashed vegetables with butter pav.", price: 160, category: "Main Course", isVeg: true, images: [{ public_id: "f3", url: "https://images.unsplash.com/photo-1606755962773-d324e2b99cda?w=400" }] },
      { name: "Dahi Bhalla", description: "Lentil dumplings served with yogurt.", price: 120, category: "Snacks", isVeg: true, images: [{ public_id: "f4", url: "https://images.unsplash.com/photo-1619029907287-b9e9f94c70c0?w=400" }] },
      { name: "Rasmalai", description: "Sweet paneer dumplings in milk.", price: 130, category: "Desserts", isVeg: true, images: [{ public_id: "f5", url: "https://images.unsplash.com/photo-1633945274405-b6c8069047d?w=400" }] }
    ]
  },

  {
    restaurantName: "Bikanervala",
    items: [
      { name: "Rajma Chawal", description: "Kidney beans curry with rice.", price: 200, category: "Main Course", isVeg: true, images: [{ public_id: "f6", url: "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?w=400" }] },
      { name: "Chole Kulche", description: "Spicy chickpea curry with kulche.", price: 160, category: "Main Course", isVeg: true, images: [{ public_id: "f7", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400" }] },
      { name: "Paneer Tikka", description: "Grilled paneer cubes with spices.", price: 260, category: "Starters", isVeg: true, images: [{ public_id: "f8", url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400" }] },
      { name: "Samosa", description: "Deep fried potato pastry.", price: 60, category: "Snacks", isVeg: true, images: [{ public_id: "f9", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" }] },
      { name: "Gulab Jamun", description: "Milk dumplings in sugar syrup.", price: 120, category: "Desserts", isVeg: true, images: [{ public_id: "f10", url: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400" }] }
    ]
  },

  {
    restaurantName: "Saravana Bhavan",
    items: [
      { name: "Masala Dosa", description: "Crispy dosa filled with potatoes.", price: 180, category: "Main Course", isVeg: true, images: [{ public_id: "f11", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400" }] },
      { name: "Idli Sambar", description: "Steamed rice cakes with lentil soup.", price: 120, category: "Main Course", isVeg: true, images: [{ public_id: "f12", url: "https://images.unsplash.com/photo-1626100145153-96a2ef749acd?w=400" }] },
      { name: "Medu Vada", description: "Crispy lentil donut.", price: 130, category: "Snacks", isVeg: true, images: [{ public_id: "f13", url: "https://images.unsplash.com/photo-1604908176997-4314ed2a43db?w=400" }] },
      { name: "Vegetable Uttapam", description: "Thick dosa topped with vegetables.", price: 170, category: "Main Course", isVeg: true, images: [{ public_id: "f14", url: "https://images.unsplash.com/photo-1626132647523-66d2f2a444ef?w=400" }] },
      { name: "Filter Coffee", description: "South Indian filter coffee.", price: 90, category: "Beverages", isVeg: true, images: [{ public_id: "f15", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400" }] }
    ]
  },

  {
    restaurantName: "Barbeque Nation",
    items: [
      { name: "Paneer Tikka", description: "Grilled paneer cubes.", price: 320, category: "Starters", isVeg: true, images: [{ public_id: "f16", url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400" }] },
      { name: "Veg Seekh Kebab", description: "Spiced vegetable kebabs.", price: 290, category: "Starters", isVeg: true, images: [{ public_id: "f17", url: "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=400" }] },
      { name: "Dal Makhani", description: "Slow cooked black lentils.", price: 260, category: "Main Course", isVeg: true, images: [{ public_id: "f18", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" }] },
      { name: "Veg Biryani", description: "Fragrant rice cooked with vegetables.", price: 280, category: "Main Course", isVeg: true, images: [{ public_id: "f19", url: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400" }] },
      { name: "Kulfi", description: "Traditional Indian ice cream.", price: 120, category: "Desserts", isVeg: true, images: [{ public_id: "f20", url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400" }] }
    ]
  },

  {
    restaurantName: "Wow! Momo",
    items: [
      { name: "Veg Steamed Momos", description: "Steamed dumplings with vegetables.", price: 140, category: "Main Course", isVeg: true, images: [{ public_id: "f21", url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400" }] },
      { name: "Fried Momos", description: "Deep fried vegetable dumplings.", price: 150, category: "Main Course", isVeg: true, images: [{ public_id: "f22", url: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=400" }] },
      { name: "Tandoori Momos", description: "Grilled spicy momos.", price: 180, category: "Main Course", isVeg: true, images: [{ public_id: "f23", url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400" }] },
      { name: "Momo Burger", description: "Burger filled with momo stuffing.", price: 160, category: "Burgers", isVeg: true, images: [{ public_id: "f24", url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" }] },
      { name: "Chocolate Momos", description: "Sweet chocolate filled momos.", price: 170, category: "Desserts", isVeg: true, images: [{ public_id: "f25", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400" }] }
    ]
  },

  {
    restaurantName: "Biryani By Kilo",
    items: [
      { name: "Hyderabadi Veg Biryani", description: "Fragrant rice cooked with vegetables.", price: 320, category: "Main Course", isVeg: true, images: [{ public_id: "f26", url: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400" }] },
      { name: "Paneer Biryani", description: "Biryani cooked with paneer.", price: 340, category: "Main Course", isVeg: true, images: [{ public_id: "f27", url: "https://images.unsplash.com/photo-1604908176997-4314ed2a43db?w=400" }] },
      { name: "Veg Kofta Curry", description: "Vegetable kofta in rich gravy.", price: 260, category: "Main Course", isVeg: true, images: [{ public_id: "f28", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400" }] },
      { name: "Butter Naan", description: "Soft naan bread with butter.", price: 60, category: "Breads", isVeg: true, images: [{ public_id: "f29", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" }] },
      { name: "Shahi Tukda", description: "Royal Mughlai dessert.", price: 150, category: "Desserts", isVeg: true, images: [{ public_id: "f30", url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400" }] }
    ]
  },

  {
    restaurantName: "Cafe Coffee Day",
    items: [
      { name: "Cappuccino", description: "Fresh espresso with milk foam.", price: 140, category: "Beverages", isVeg: true, images: [{ public_id: "f31", url: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400" }] },
      { name: "Cold Coffee", description: "Iced coffee blended with milk.", price: 160, category: "Beverages", isVeg: true, images: [{ public_id: "f32", url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400" }] },
      { name: "Veg Sandwich", description: "Grilled vegetable sandwich.", price: 150, category: "Snacks", isVeg: true, images: [{ public_id: "f33", url: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400" }] },
      { name: "Chocolate Brownie", description: "Warm chocolate brownie.", price: 120, category: "Desserts", isVeg: true, images: [{ public_id: "f34", url: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400" }] },
      { name: "Garlic Bread", description: "Toasted bread with garlic butter.", price: 130, category: "Sides", isVeg: true, images: [{ public_id: "f35", url: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400" }] }
    ]
  },

  {
    restaurantName: "Goli Vada Pav",
    items: [
      { name: "Classic Vada Pav", description: "Spicy potato patty in pav bun.", price: 90, category: "Snacks", isVeg: true, images: [{ public_id: "f36", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" }] },
      { name: "Cheese Vada Pav", description: "Vada pav topped with cheese.", price: 110, category: "Snacks", isVeg: true, images: [{ public_id: "f37", url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" }] },
      { name: "Masala Fries", description: "Crispy fries with spicy seasoning.", price: 120, category: "Sides", isVeg: true, images: [{ public_id: "f38", url: "https://images.unsplash.com/photo-1630384066252-162165b76d14?w=400" }] },
      { name: "Paneer Roll", description: "Soft roll stuffed with paneer.", price: 140, category: "Snacks", isVeg: true, images: [{ public_id: "f39", url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" }] },
      { name: "Mango Lassi", description: "Refreshing yogurt mango drink.", price: 100, category: "Beverages", isVeg: true, images: [{ public_id: "f40", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400" }] }
    ]
  }

];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    console.log("Old Data deleted");

    const insertedRestaurants = await Restaurant.insertMany(restaurantData);
    console.log("Restaurants added");

    const finalFoods = [];
    foodItems.forEach(group => {
      const restaurant = insertedRestaurants.find(r => r.name === group.restaurantName);
      if (restaurant) {
        group.items.forEach(item => {
          finalFoods.push({ ...item, restaurant: restaurant._id });
        });
      }
    });

    await FoodItem.insertMany(finalFoods);
    console.log("Vegetarian Food Items added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedData();
