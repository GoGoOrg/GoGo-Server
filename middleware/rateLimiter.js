const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: {
    status: false,
    errorMessage: "Too many requests from this IP, please try again later.",
  },
});

module.exports = apiLimiter;
