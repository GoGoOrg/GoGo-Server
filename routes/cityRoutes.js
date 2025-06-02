const express = require('express');
const cityControler = require('../controller/cityController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Feedback management
router.get('/', cityControler.getAll);
router
  .route('/:id')
  .get(cityControler.getOne)
  .patch(cityControler.update)
  .delete(cityControler.delete);

module.exports = router;
