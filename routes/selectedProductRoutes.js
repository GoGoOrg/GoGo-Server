const express = require('express');
const selectedProductController = require('./../controller/selectedProductController');

const router = express.Router();

router
  .route('/')
  .get(selectedProductController.getAll)
  .post(selectedProductController.create);
router
  .route('/:id')
  .get(selectedProductController.getOne)
  .delete(selectedProductController.delete);
router
  .route('/account/:id')
  .get(selectedProductController.getAllByAccountIdInCart)
router
  .route('/quantity/:id')
  .patch(selectedProductController.updateQuantity)
module.exports = router;
