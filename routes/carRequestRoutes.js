const express = require("express");
const carRequestController = require("../controller/carRequestController");
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car request management
router.get("/", carRequestController.getAll);
router.get("/car/:carid", carRequestController.getAllByCarid);
router.get("/user/:userid", carRequestController.getAllByUserid);
router.get(
  "/car/:carid/user/:userid",
  carRequestController.getOneByCaridAndUserid
);
router.post("/", carRequestController.create);
router
  .route("/:id")
  .get(carRequestController.getOne)
  .patch(carRequestController.update)
  .delete(carRequestController.delete);

module.exports = router;
