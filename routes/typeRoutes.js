const express = require('express');
const typeController = require('./../controller/typeController');

const router = express.Router();

router
    .route('/')
    .get(typeController.getAll)
    .post(typeController.create)
router
    .route('/:id')
    .get(typeController.getOne)
    .delete(typeController.delete)
    .patch(typeController.update);
router
    .route('/product/:id')
    .get(typeController.getAllByProductId)
    
module.exports = router;
