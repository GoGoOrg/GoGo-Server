const express = require('express');
const userController = require('../controller/userController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Auth & account
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/google', userController.loginGoogle);
router.get('/me', userController.getMe); // optionally add auth middleware

// Password & avatar
router.patch('/password', userController.changePassword);
router.patch('/avatar/:id', userController.updateAvatar);

// User management
router.get('/', userController.getAll);
router
  .route('/:id')
  .get(userController.getOne)
  .patch(userController.update)
  .delete(userController.delete);

module.exports = router;
