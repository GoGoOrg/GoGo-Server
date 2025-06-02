const express = require('express');
const fuelTypeController = require('../controller/fuelTypeController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', fuelTypeController.getAll);
router
  .route('/:id')
  .get(fuelTypeController.getOne)
  .patch(fuelTypeController.update)
  .delete(fuelTypeController.delete);

module.exports = router;
