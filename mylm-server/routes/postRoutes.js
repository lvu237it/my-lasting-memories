const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

//general router: /posts/
router.get('/', postController.getAllPosts);
router.post('/bycontent', postController.getPostsByContent);
router.get('/:postid', postController.getPostById);
router.post('/createpost', postController.createPost);
router.patch(
  '/update/:postid',
  postController.checkPostIsExist,
  postController.updatePost
);
router.patch(
  '/delete/:postid',
  postController.checkPostIsExist,
  postController.deletePost
);

module.exports = router;
