const express = require('express');
const carControler = require('../controller/carController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', carControler.getAll);
router
  .route('/:id')
  .get(carControler.getOne)
  .patch(carControler.update)
  .delete(carControler.delete);

module.exports = router;
