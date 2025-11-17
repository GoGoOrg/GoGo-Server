const express = require('express');
const notificationController = require('../controller/notificationController');
// const authMiddleware = require('../middleware/auth'); // optional 

const router = express.Router();

router.get('/', notificationController.getAll);
router.get('/user/:id', notificationController.getAllByUserId);
router
  .route('/:id')
  .get(notificationController.getOne)
  .patch(notificationController.update)
  .delete(notificationController.delete);

module.exports = router;
