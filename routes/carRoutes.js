const express = require('express');
const prodController = require('../controller/carController');

const router = express.Router();

router
    .route('/')
    .get(prodController.getAll)
    .post(prodController.create);
router
    .route('/:id')
    .get(prodController.getOne)
    .patch(prodController.update)
    .delete(prodController.delete);
router
    .route('/detail/:id')
    .get(prodController.getOneDetails);
router
    .route('/brand/:id')
    .get(prodController.getAllByBrandId);
router
    .route('/topsale/:id')
    .get(prodController.getTopSales);
router
    .route('/detailbrand/:id')
    .get(prodController.getAllDetailByBrandId);
router
    .route('/category/:id')
    .get(prodController.getAllByCategoryId);
router
    .route('/categorynolimit/:id')
    .get(prodController.getAllByCategoryIdNoLimit);
module.exports = router;
