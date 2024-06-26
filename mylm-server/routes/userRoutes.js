const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//general router: /users/
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/checkrememberme', authController.checkRememberMe);

router.post('/forgotPassword', authController.forgotPassword);
router.get('/verifyResetToken/:token', authController.verifyResetToken);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updatepassword',
  authController.protect,
  authController.updateUserPassword
);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

module.exports = router;
