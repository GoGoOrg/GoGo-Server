const express = require('express');
const reviewControler = require('../controller/reviewController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', reviewControler.getAll);
router
  .route('/:id')
  .get(reviewControler.getOne)
  .patch(reviewControler.update)
  .delete(reviewControler.delete);

module.exports = router;
