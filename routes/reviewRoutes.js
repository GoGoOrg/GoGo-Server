const express = require('express');
const reviewController = require('../controller/reviewController');

const router = express.Router();

// Create & Get all reviews
router
  .route('/')
  .get(reviewController.getAll)
  .post(reviewController.create);

// Get, Update, Delete a review by ID
router
  .route('/:id')
  .get(reviewController.getOne)
  .patch(reviewController.update)
  .delete(reviewController.delete);

// Get reviews by car ID
router
  .route('/car/:id')
  .get(reviewController.getAllByCarId);

// Get reviews by car ID and user ID
router
  .route('/car/:carId/user/:userId')
  .get(reviewController.getAllByCarIdAndUserId);

module.exports = router;
