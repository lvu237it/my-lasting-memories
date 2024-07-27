const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const userController = require('./userController');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình Multer để lưu trữ file
// Set the storage engine.
// The destination is the folder you want the uploaded file to be saved.
//  You will have to create the destination folder yourself in the project folder.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'assets/comments-images'));
  },
  filename: async (req, file, cb) => {
    const files = fs.readdirSync(
      path.join(__dirname, '..', 'assets/comments-images')
    );
    const originalname = file.originalname;

    // Kiểm tra xem tên file đã tồn tại trong thư mục hay chưa
    // Đọc danh sách các file trong thư mục assets/images.
    if (files.includes(originalname)) {
      console.log(`File ${originalname} đã tồn tại, bỏ qua upload.`);
      cb(null, originalname); // Nếu file đã tồn tại, không thay đổi tên file
    } else {
      cb(null, Date.now() + '-' + originalname); // Nếu file chưa tồn tại, thực hiện upload bình thường
    }
  },
});

// Set up multer instance
// Limit is by default set to 1mb but using the limit property we can set it to 10MB
exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

//Get existed comments (EXCEPT deleted comments)
exports.getAllCommentsByPostId = catchAsync(async (req, res, next) => {
  const postid = req.post_id;
  const rows = await poolQuery(
    'SELECT * FROM comments WHERE is_deleted = 0 and post_id = $1 ORDER BY created_at DESC',
    [postid]
  );

  if (!rows) {
    return next(new AppError('No comments found', 404));
  }

  //Test API using Postman
  // res.status(200).json({
  //   status: 'success',
  //   results: rows.length,
  //   data: {
  //     data: rows,
  //   },
  // });

  //Response to client
  res.status(200).json(rows);
});

exports.createComment = catchAsync(async (req, res, next) => {
  // const postid = req.post_id;
  const { postid, comment_content, user_id } = req.body;
  const comment_id = uuidv4();
  const files = req.files || [];

  if (files && files.length > 10) {
    return next(new AppError('Not exceed 10 files per comment', 400));
  }

  // Lưu thông tin comment vào cơ sở dữ liệu
  await poolExecute(
    'INSERT INTO comments(comment_id, comment_content, post_id, user_id) VALUES ($1, $2, $3, $4)',
    [comment_id, comment_content, postid, user_id]
  );

  //Chỉ bình luận content mà ko post ảnh
  if (!files || files.length === 0) {
    res.status(200).json({
      status: 'success',
      message: 'create comment successfully!',
    });
  }

  req.comment_id = comment_id;
  if (files) {
    req.files = files;
  }
  next();
});

exports.uploadCommentImages = catchAsync(async (req, res, next) => {
  const comment_id = req.comment_id;
  const files = req.files;

  const promises = files.map(async (file) => {
    const attached_items_comment_id = uuidv4(); // Tạo attached_items_id mới cho mỗi ảnh
    const attacheditem_comment_path = `/assets/images/${file.filename}`;
    const attachedValues = [
      attached_items_comment_id,
      attacheditem_comment_path,
      comment_id,
    ];

    // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
    await poolExecute(
      'INSERT INTO attached_items_comments(attached_items_comment_id, attacheditem_comment_path, comment_id) VALUES ($1, $2, $3)',
      attachedValues
    );
  });

  // Chờ cho tất cả các promise được giải quyết
  await Promise.all(promises);

  res.status(200).json({
    status: 'success',
    message: 'create comment and upload images successfully!',
  });
});

exports.checkCommentIsExist = catchAsync(async (req, res, next) => {
  const { commentid } = req.params;
  console.log('commentid', commentid);
  const rows = await poolQuery(
    'select * from comments where comment_id = $1 and is_deleted = 0',
    [commentid]
  );

  if (rows.length === 0) {
    return next(new AppError('No comment found', 404));
  }
  req.commentid = commentid;
  next();
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const commentid = req.commentid;
  const { comment_content } = req.body;

  await poolExecute(
    'UPDATE comments SET comment_content = $1 WHERE comment_id = $2',
    [comment_content, commentid]
  );

  res.status(200).json({
    status: 'success',
    message: 'update comment successfully!',
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const commentid = req.commentid;
  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  await poolExecute(
    'UPDATE comments SET is_deleted = $1, deletedat = $2 where comment_id = $3',
    [1, currentDateTime, commentid]
  );

  res.status(200).json({
    status: 'success',
    message: 'delete comment successfully!',
  });
});
