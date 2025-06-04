const express = require('express');
const carTagController = require('../controller/carTagController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car tag management
router.get('/', carTagController.getAll);
router
  .route('/:id')
  .get(carTagController.getOne)
  .patch(carTagController.update)
  .delete(carTagController.delete);

module.exports = router;
