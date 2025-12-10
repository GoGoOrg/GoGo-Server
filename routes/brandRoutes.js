const express = require('express');
const brandController = require('../controller/brandController');
// const {  } = require('../middleware/cacheRedis');

const router = express.Router();

// Feedback management
router.get('/', brandController.getAll);
router
  .route('/:id')
  .get(brandController.getOne)
  .patch(brandController.update)
  .delete(brandController.delete);

module.exports = router;
