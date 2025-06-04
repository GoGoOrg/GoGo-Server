const express = require('express');
const favoriteController = require('../controller/favoriteController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', favoriteController.getAll);
router
  .route('/:id')
  .get(favoriteController.getOne)
  .patch(favoriteController.update)
  .delete(favoriteController.delete);

module.exports = router;
