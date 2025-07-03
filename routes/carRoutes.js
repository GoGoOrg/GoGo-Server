const express = require("express");
const carControler = require("../controller/carController");
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

router.route("/").get(carControler.getAll).post(carControler.create);

router.route("/owner/:id").get(carControler.getAllByOwnerId);

router
  .route("/:id")
  .get(carControler.getOne)
  .patch(carControler.update)
  .delete(carControler.delete);
module.exports = router;
