const express = require('express');
const carAvailabilityController = require('../controller/carAvailabilityController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car tag management
router.get('/', carAvailabilityController.getAll);
router
  .route('/:id')
  .get(carAvailabilityController.getOne)
  .patch(carAvailabilityController.update)
  .delete(carAvailabilityController.delete);

module.exports = router;
