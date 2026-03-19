const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Route Imports
const user = require("./routes/userRoutes");
const restaurant = require("./routes/restaurantRoutes");
const food = require("./routes/foodRoutes");
const order = require("./routes/orderRoutes");
const admin = require("./routes/adminRoutes");
const notification = require("./routes/notificationRoutes");

app.use("/api/v1", user);
app.use("/api/v1", restaurant);
app.use("/api/v1", food);
app.use("/api/v1", order);
app.use("/api/v1", admin);
app.use("/api/v1", notification);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
