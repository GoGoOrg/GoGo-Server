const express = require('express');
const utilityController = require('../controller/utilityController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car img management
router.get('/', utilityController.getAll);
router
  .route('/:id')
  .get(utilityController.getOne)
  .patch(utilityController.update)
  .delete(utilityController.delete);

module.exports = router;
