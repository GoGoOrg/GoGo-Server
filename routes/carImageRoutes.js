const express = require('express');
const carImageController = require('../controller/carImageController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car img management
router.get('/', carImageController.getAll);
router
  .route('/:id')
  .get(carImageController.getOne)
  .patch(carImageController.update)
  .delete(carImageController.delete);

module.exports = router;
