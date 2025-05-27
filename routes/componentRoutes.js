const express = require('express');
const compController = require('./../controller/componentController');

const router = express.Router();

router
    .route('/')
    .get(compController.getAll)
    .post(compController.create);
router
    .route('/:id')
    .get(compController.getOne)
    .delete(compController.delete)
    .patch(compController.update)

module.exports = router;
