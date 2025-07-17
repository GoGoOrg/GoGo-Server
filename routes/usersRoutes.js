const express = require("express");
const usersController = require("../controller/usersController");
const checkToken = require("../middleware/checkToken"); // import your middleware

const router = express.Router();

// Public routes
router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.post("/google", usersController.loginGoogle);

// Protect everything below
router.use(checkToken);

// Protected routes
router.get("/me", usersController.getMe);
router.patch("/password", usersController.changePassword);
router.patch("/avatar/:id", usersController.updateAvatar);
router.get("/", usersController.getAll);
router
  .route("/:id")
  .get(usersController.getOne)
  .patch(usersController.update)
  .delete(usersController.delete);
router.post("/logout", usersController.logout)
module.exports = router;
