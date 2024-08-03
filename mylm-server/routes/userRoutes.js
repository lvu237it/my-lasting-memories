const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

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

router.patch(
  '/update-user-information/:userid',
  userController.updateUserInformation
);

router.get(
  '/current-logged-in-information',
  userController.getCurrentLoggedInUserInformation
);

router.route('/').get(
  // authController.protect,
  // authController.restrictTo('admin', 'user'),
  userController.getAllUsers
);

//Get user by post id: /users/post/:postid
router.get(
  '/post/:postid',
  postController.checkPostIsExist,
  userController.getUserByPostId
);

//Get user by id
router.get('/:userid', userController.getUserByUserId);

module.exports = router;
