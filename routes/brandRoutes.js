const express = require('express');
const brandController = require('../controller/brandController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', brandController.getAll);
router
  .route('/:id')
  .get(brandController.getOne)
  .patch(brandController.update)
  .delete(brandController.delete);

module.exports = router;
