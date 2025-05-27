const express = require('express');
const orderController = require('./../controller/orderController');

const router = express.Router();

router
  .route('/')
  .get(orderController.getAll)
  .post(orderController.create);
router
  .route('/confirm/:id')
  .get(orderController.getAllConfirmedOrder)
router
  .route('/unconfirm/:id')
  .get(orderController.getAllUnConfirmedOrder)
router
  .route('/paid/:id')
  .patch(orderController.updatePaid)
router
  .route('/shipment/:id')
  .patch(orderController.updateShipmentTracking)
router
  .route('/review/:id')
  .patch(orderController.checkReviewed)
router
  .route('/:id')
  .get(orderController.getOne)
  .patch(orderController.update)
  .delete(orderController.delete);
router
  .route('/account/:id')
  .get(orderController.getAllByAccountIdAndShipped)
router
  .route('/detail/:id')
  .get(orderController.getDetailsByAccountId)
router
  .route('/all/detail')
  .get(orderController.getAllDetailsByAccountId)
router
  .route('/singledetail/:id')
  .get(orderController.getDetailsByOrderId)
router 
  .route('/ordernow/:id')
  .post(orderController.orderNow)
router
  .route('/cancel/:id')
  .post(orderController.cancel)
module.exports = router;
