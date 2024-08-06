const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const assetsController = require('../controllers/assetsController');

//general router: /image-sources/
router.get('/images', assetsController.getAllAssetsImages);
router.get('/images-comments', assetsController.getAllAssetsImagesComments);

module.exports = router;
