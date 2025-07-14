const express = require("express");
const carControler = require("../controller/carController");
const { cache } = require('../middleware/cacheRedis');

const router = express.Router();

router.route("/").get(cache('cars', 300), carControler.getAll).post(carControler.create);

router.route("/owner/:id").get(cache('cars', 300), carControler.getAllByOwnerId);
router.route("/brand/:id").get(cache('cars', 300), carControler.getAllByBrandId);
router
  .route("/:id")
  .get(cache('cars', 300), carControler.getOne)

  .patch(carControler.update)
  .delete(carControler.delete);
module.exports = router;
