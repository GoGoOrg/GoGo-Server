const express = require('express');
const tagController = require('../controller/tagController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// tag management
router.get('/', tagController.getAll);
router
  .route('/:id')
  .get(tagController.getOne)
  .patch(tagController.update)
  .delete(tagController.delete);

module.exports = router;
