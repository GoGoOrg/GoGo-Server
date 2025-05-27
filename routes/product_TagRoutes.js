const express = require('express');
const product_TagController = require('./../controller/product_TagController');

const router = express.Router();

// router
//   .route('/me')
//   .get(product_TagController.getMe)
router
  .route('/')
  .get(product_TagController.getAll)
// router
//   .route('/login')
//   .post(product_TagController.login);
// router
//   .route('/register')
//   .post(product_TagController.register);
// router
//   .route('/password')
//   .post(product_TagController.changePassword);
router
  .route('/:id')
  .get(product_TagController.getOne)
  // .patch(product_TagController.update)
router
  .route('/product/:id')
  .get(product_TagController.getAllByProductId)
router
  .route('/tag/:id')
  .get(product_TagController.getAllByTagId)
module.exports = router;
