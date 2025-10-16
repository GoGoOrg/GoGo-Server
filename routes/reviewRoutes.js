const express = require("express");
const reviewControler = require("../controller/reviewController");
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.post("/", reviewControler.create);
router.get("/", reviewControler.getAll);
router
  .route("/:id")
  .get(reviewControler.getOne)
  .patch(reviewControler.update)
  .delete(reviewControler.delete);
router
  .route("/car/:carid/user/:userid")
  .get(reviewControler.getAllByCaridAndUserid);
router.route("/car/:carid").get(reviewControler.getAllByCarid);
module.exports = router;
