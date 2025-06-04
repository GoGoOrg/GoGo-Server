const express = require('express');
const promotionController = require('../controller/promotionController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// promotion management
router.get('/', promotionController.getAll);
router
  .route('/:id')
  .get(promotionController.getOne)
  .patch(promotionController.update)
  .delete(promotionController.delete);

module.exports = router;
