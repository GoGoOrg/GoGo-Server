const express = require('express');
const brandController = require('../controller/brandController');
const { cache } = require('../middleware/cacheRedis');

const router = express.Router();

// Feedback management
router.get('/', cache('brands', 300), brandController.getAll);
router
  .route('/:id')
  .get(brandController.getOne)
  .patch(brandController.update)
  .delete(brandController.delete);

module.exports = router;
