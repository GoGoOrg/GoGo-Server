const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const apiLimiter = require("./middleware/rateLimiter"); 
const logger = require('./utils/logger');

const errorHandler = require("./middleware/errorHandler");

const usersRoutes = require("./routes/usersRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const fuelTypeRoutes = require("./routes/fuelTypeRoutes");
const brandRoutes = require("./routes/brandRoutes");
const tagRoutes = require("./routes/tagRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const transmissionTypeRoutes = require("./routes/transmissionTypeRoutes");
const cityRoutes = require("./routes/cityRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const carAvailabilityRoutes = require("./routes/carAvailabilityRoutes");
const carPromotionRoutes = require("./routes/carPromotionRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const carUtilityRoutes = require("./routes/carUtilityRoutes");
const carTagRoutes = require("./routes/carTagRoutes");
const utilityRoutes = require("./routes/utilityRoutes");
const carImageRoutes = require("./routes/carImageRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));

// app.use(apiLimiter); => consider enable in production
app.use("/api/users", usersRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/transmission-type", transmissionTypeRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/fueltypes", fuelTypeRoutes);
app.use("/api/citys", cityRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/car-availability", carAvailabilityRoutes);
app.use("/api/car-promotion", carPromotionRoutes);
app.use("/api/promotion", promotionRoutes);
app.use("/api/car-utility", carUtilityRoutes);
app.use("/api/car-tag", carTagRoutes);
app.use("/api/utility", utilityRoutes);
app.use("/api/car-image", carImageRoutes);
app.use("/api/favorite", favoriteRoutes);

app.use(errorHandler);
app.get('/api/health', (req, res) => {
    logger.info('Health check requested');
    res.json({ status: 'ok' });
});

module.exports = app;
