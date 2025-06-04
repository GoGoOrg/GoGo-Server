const express = require('express');
const carPromotionController = require('../controller/carPromotionController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car tag management
router.get('/', carPromotionController.getAll);
router
  .route('/:id')
  .get(carPromotionController.getOne)
  .patch(carPromotionController.update)
  .delete(carPromotionController.delete);

module.exports = router;
