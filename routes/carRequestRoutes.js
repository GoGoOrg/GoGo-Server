const express = require('express');
const carRequestController = require('../controller/carRequestController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// car tag management
router.get('/', carRequestController.getAll);
router.get('/car/:carId', carRequestController.getAllByCarId);
router.get('/user/:userId', carRequestController.getAllByUserId);
router.get('/car/:carId/user/:userId', carRequestController.getOneByCarIdAndUserId);
router
  .route('/:id')
  .get(carRequestController.getOne)
  .patch(carRequestController.update)
  .delete(carRequestController.delete);

module.exports = router;
