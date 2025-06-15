const express = require('express');
const usersController = require('../controller/usersController');
// const authMiddleware = require('../middleware/auth'); // optional suggestion

const router = express.Router();

// Auth & account
router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/google', usersController.loginGoogle);
router.get('/me', usersController.getMe); // optionally add auth middleware

// Password & avatar
router.patch('/password', usersController.changePassword);
router.patch('/avatar/:id', usersController.updateAvatar);

// User management
router.get('/', usersController.getAll);
router
  .route('/:id')
  .get(usersController.getOne)
  .patch(usersController.update)
  .delete(usersController.delete);

module.exports = router;
