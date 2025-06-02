const express = require('express');
const transmissionTypeController = require('../controller/transmissionTypeController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', transmissionTypeController.getAll);
router
  .route('/:id')
  .get(transmissionTypeController.getOne)
  .patch(transmissionTypeController.update)
  .delete(transmissionTypeController.delete);

module.exports = router;
