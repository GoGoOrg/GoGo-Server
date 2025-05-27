const express = require('express');
const chatbotController = require('./../controller/chatbotController');

const router = express.Router();

router
  .route('/')
  .post(chatbotController.ask);


module.exports = router;
