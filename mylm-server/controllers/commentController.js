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
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

// Configuration for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

// Cấu hình Multer để lưu trữ file
// Set the storage engine.
// The destination is the folder you want the uploaded file to be saved.
//  You will have to create the destination folder yourself in the project folder.
// Define storage settings
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '..', 'assets/commentsimages'));
//   },
//   filename: (req, file, cb) => {
//     const dirPath = path.join(__dirname, '..', 'assets/commentsimages');
//     const originalname = file.originalname;

//     // Check if the file already exists
//     fs.readdir(dirPath, (err, files) => {
//       if (err) {
//         console.error('Error reading directory:', err);
//         cb(err);
//       } else {
//         if (files.includes(originalname)) {
//           console.log(`File ${originalname} already exists, skipping upload.`);
//           cb(null, originalname); // Keep the original name if file exists
//         } else {
//           cb(null, Date.now() + '-' + originalname); // Append timestamp if file does not exist
//         }
//       }
//     });
//   },
// });

// Set up multer storage using memory storage
const storage = multer.memoryStorage();

// Set up multer instance
// Limit is by default set to 1mb but using the limit property we can set it to 10MB
exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new AppError('Invalid file type', 400));
  },
});

//Get existed comments (EXCEPT deleted comments)
exports.getAllCommentsByPostId = catchAsync(async (req, res, next) => {
  const postid = req.post_id;
  const rows = await poolQuery(
    'SELECT * FROM comments WHERE is_deleted = 0 and post_id = $1 ORDER BY created_at ASC',
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

exports.getImagesOfCommentsByPostId = catchAsync(async (req, res, next) => {
  const postid = req.post_id;

  //Truy vấn toàn bộ ảnh group by comment của post đó
  //Filter theo comment cụ thể - comment.comment_id
  //Sau đó dùng find (client side) để lấy được attached_items_comment_path

  const rows = await poolQuery(
    'select comments.comment_id, comments.comment_content, comments.post_id, comments.user_id, attached_items_comments.attached_items_comment_id, attached_items_comments.attacheditem_comment_path from comments join posts on comments.post_id = posts.post_id join attached_items_comments ON attached_items_comments.comment_id = comments.comment_id where comments.post_id LIKE $1 and comments.is_deleted = 0 ORDER BY attached_items_comments.attacheditem_comment_path DESC',
    [postid]
  );

  if (!rows) {
    return next(new AppError('No images found', 404));
  }

  // Nhóm dữ liệu theo comment_id
  const groupedData = rows.reduce((acc, row) => {
    const commentId = row.comment_id;
    if (!acc[commentId]) {
      acc[commentId] = {
        comment_id: commentId,
        comment_content: row.comment_content,
        post_id: row.post_id,
        user_id: row.user_id,
        attached_items: [],
      };
    }
    acc[commentId].attached_items.push({
      attached_items_comment_id: row.attached_items_comment_id,
      attacheditem_comment_path: row.attacheditem_comment_path,
    });
    return acc;
  }, {});

  // Chuyển đổi đối tượng thành mảng
  const responseData = Object.values(groupedData);

  res.status(200).json(responseData);
});

exports.createComment = catchAsync(async (req, res, next) => {
  const postid = req.post_id;
  const { comment_content, user_id, images_array } = req.body;
  console.log('imagesArray:', images_array); // Kiểm tra images
  const comment_id = uuidv4();
  const imageArray = JSON.parse(images_array);

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  // Lưu thông tin comment vào cơ sở dữ liệu
  await poolExecute(
    'INSERT INTO comments(comment_id, comment_content, created_at, post_id, user_id) VALUES ($1, $2, $3, $4, $5)',
    [comment_id, comment_content, currentDateTime, postid, user_id]
  );

  // Chỉ bình luận content mà ko post ảnh
  if (!imageArray || imageArray.length === 0) {
    res.status(200).json({
      status: 'success',
      message: 'create comment successfully!',
    });
  }
  req.comment_id = comment_id;
  req.imageArray = imageArray;
  next();
});

// const uploadToCloudinary = (fileBuffer, attached_items_comment_id) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'comments-images',
//         public_id: `comments-images/${attached_items_comment_id}/${uuidv4()}`,
//         resource_type: 'image',
//         // upload_preset: 'my_lasting_memories_2307_comments_images',
//       },
//       (error, result) => {
//         if (error) {
//           reject(new AppError('Error uploading to Cloudinary', 500));
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };

//Uploads ảnh lên Cloudinary - đồng thời lưu thông tin vào database
exports.uploadCommentImages = catchAsync(async (req, res, next) => {
  const comment_id = req.comment_id;
  const imageArray = req.imageArray;

  try {
    const uploadPromises = imageArray.map(async (imageUrl) => {
      const attached_items_comment_id = uuidv4(); // Tạo attached_items_id mới cho mỗi ảnh

      const attacheditem_comment_path = imageUrl;
      console.log('result.secure_url', attacheditem_comment_path);

      const attachedValues = [
        attached_items_comment_id,
        attacheditem_comment_path,
        comment_id,
      ];

      console.log('attachedValues', attachedValues);

      // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
      await poolExecute(
        'INSERT INTO attached_items_comments(attached_items_comment_id, attacheditem_comment_path, comment_id) VALUES ($1, $2, $3)',
        attachedValues
      );
    });

    // Chờ cho tất cả các promise được giải quyết
    await Promise.all(uploadPromises);

    res.status(200).json({
      status: 'success',
      message: 'create comment and upload images successfully!',
    });
  } catch (error) {
    console.error('Error uploading comments images:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload comments images.',
    });
  }
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

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  await poolExecute(
    'UPDATE comments SET comment_content = $1, updated_at = $2 WHERE comment_id = $3',
    [comment_content, currentDateTime, commentid]
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
