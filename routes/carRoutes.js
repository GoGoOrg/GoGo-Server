const express = require("express");
const carControler = require("../controller/carController");
// const {  } = require("../middleware/cacheRedis");
const checkToken = require("../middleware/checkToken");

const router = express.Router();

// Public routes
router.route("/").get(carControler.getAll);
router.route("/:id").get(carControler.getOne);
router
  .route("/brand/:id")
  .get(carControler.getAllByBrandid);
router.get("/carrequest/:id", carControler.getTopCars);

router.route("/search/:name").get(carControler.searchByName);
router.route("/city/:name").get(carControler.searchByCityName);
// Protect everything below
router.use(checkToken);

// Protected routes
router.route("/").post(carControler.create);
router.route("/:id").patch(carControler.update).delete(carControler.delete);
router
  .route("/owner/:id")
  .get(carControler.getAllByOwnerid);
router.route("/mycars").get(carControler.getMyCar);
module.exports = router;
