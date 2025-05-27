const express = require('express');
const brandController = require('./../controller/brandController');

const router = express.Router();

router
    .route('/')
    .get(brandController.getAll)
    .post(brandController.create);
router
    .route('/:id')
    .get(brandController.getOne)
    .patch(brandController.update)
    .delete(brandController.delete);
router
    .route('/top/10')
    .get(brandController.getTop10);
module.exports = router;
