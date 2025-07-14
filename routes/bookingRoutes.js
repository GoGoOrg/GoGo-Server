const express = require("express");
const bookingControler = require("../controller/bookingController");

const router = express.Router();

// Feedback management
router.get("/", bookingControler.getAll);
router
  .route("/:id")
  .get(bookingControler.getOne)
  .patch(bookingControler.update)
  .delete(bookingControler.delete);

module.exports = router;
