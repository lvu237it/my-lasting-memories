const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

//general router: /posts/
router.get('/admin', postController.getAllPostsOfAdminPublic);
router.get('/admin/all-posts', postController.getAllPostsOfAdmin);

router.get(
  '/all-posts-of-chosen-user/:userid',
  userController.checkUserIsExistById,
  postController.getAllPostsOfChosenUserProfile
);

router.get(
  '/my-all-posts/:userid',
  userController.checkUserIsExistById,
  postController.getAllMyPosts
);

router.get(
  '/except-me/:userid',
  userController.checkUserIsExistById,
  postController.getAllPostsExceptCurrentLoggedInUser
);

router.get(
  '/get-except-me-and-admin/:userid',
  userController.checkUserIsExistById,
  postController.getAllPostsOfAdminAndExceptCurrentLoggedInUser
);

router.get(
  '/current-status/:postid',
  postController.checkPostIsExist,
  postController.getCurrentStatusOfChosenPost
);

router.patch(
  '/update-current-status/:postid',
  postController.checkPostIsExist,
  postController.updateCurrentStatusOfChosenPost
);

router.get(
  '/my-lastest-post/:userid',
  userController.checkUserIsExistById,
  postController.getLastestPostCreatedByMe
);

router.get('/:postid/images', postController.getAllImagesByPostId);
// router.post('/uploadimages', postController.uploadImages);
router.post('/bycontent', postController.getPostsByContent);
router.post(
  '/bycontent/all-and-admin-posts',
  postController.getPostsByContentAndAllOfAdminPosts
);
router.post('/bycontent-only-admin', postController.getPostsByContentOnlyAdmin);

router.get(
  '/:postid',
  postController.checkPostIsExist,
  postController.getPostById
);
router.post(
  '/createpost',
  // postController.upload.array('images', 10), //Bỏ qua bước upload vì đã upload trực tiếp từ client
  postController.createPost,
  postController.uploadImages
);
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

router.get(
  '/saved-post/my-all-saved-posts/:userid',
  postController.getAllMySavedPosts
);
router.get(
  '/saved-post/check-saved-post/:postid',
  postController.getSavedPostByPostIdAndSaverId
);
router.post(
  '/saved-post/create-for-post/:postid',
  postController.checkPostIsExist,
  postController.createSavedPost
);
router.patch(
  '/saved-post/un-save-post/:postid',
  postController.checkPostIsExist,
  postController.deleteSavedPost
);

module.exports = router;
