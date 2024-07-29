const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

//general router: /comments/
//Lấy comments của 1 post
router.get(
  '/post/:postid',
  postController.checkPostIsExist,
  commentController.getAllCommentsByPostId
);

// Lấy ảnh của các comments trong 1 post
router.get(
  '/post/:postid/images',
  postController.checkPostIsExist,
  commentController.getImagesOfCommentsByPostId
);

//Tạo comment
router.post(
  '/create',
  commentController.upload.array('imagesComment', 10), //fieldName này cần giống với tên trong formData
  postController.checkPostIsExist,
  commentController.createComment,
  commentController.uploadCommentImages
);

//Update comment
router.patch(
  '/update/:commentid',
  commentController.checkCommentIsExist,
  commentController.updateComment
);

//Delete comment
router.patch(
  '/delete/:commentid',
  commentController.checkCommentIsExist,
  commentController.deleteComment
);
module.exports = router;
