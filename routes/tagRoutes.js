const express = require('express');
const tagController = require('./../controller/tagController');

const router = express.Router();

router
    .route('/')
    .get(tagController.getAll)
    .post(tagController.create)
router
    .route('/:id')
    .get(tagController.getOne)
    .delete(tagController.delete)
    .patch(tagController.update);
router
    .route('/top/25')
    .get(tagController.getTop);
module.exports = router;
