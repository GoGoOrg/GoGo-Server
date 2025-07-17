const redisClient = require("./redisClient");

function cache(keyPrefix, ttlSeconds = 300) {
  return async (req, res, next) => {
    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);
      res.json = async (data) => {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
        originalJson(data);
      };

      next();
    } catch (error) {
      console.error("Redis error:", error);
      next();
    }
  };
}

module.exports = { cache };
