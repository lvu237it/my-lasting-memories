const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

//general router: /comments/
router.get(
  '/post/:postid',
  postController.checkPostIsExist,
  commentController.getAllCommentsByPostId
);

router.post(
  '/create',
  commentController.upload.array('images', 10),
  commentController.createComment,
  commentController.uploadCommentImages
);

router.patch(
  '/update/:commentid',
  commentController.checkCommentIsExist,
  commentController.updateComment
);

router.patch(
  '/delete/:commentid',
  commentController.checkCommentIsExist,
  commentController.deleteComment
);
module.exports = router;
