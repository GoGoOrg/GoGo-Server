const express = require('express');
const feedbackController = require('../controller/feedbackController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', feedbackController.getAll);
router
  .route('/:id')
  .get(feedbackController.getOne)
  .patch(feedbackController.update)
  .delete(feedbackController.delete);

module.exports = router;
