const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

//general router: /
router.get(
  '/information',
  // authController.restrictTo('admin'),
  adminController.getAdminInformation
);

module.exports = router;
