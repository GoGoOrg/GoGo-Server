const express = require('express');
const carUtilityController = require('../controller/carUtilityController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car tag management
router.get('/', carUtilityController.getAll);
router
  .route('/:id')
  .get(carUtilityController.getOne)
  .patch(carUtilityController.update)
  .delete(carUtilityController.delete);

module.exports = router;
