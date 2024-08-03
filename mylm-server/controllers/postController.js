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

//Get existed posts (EXCEPT deleted posts)
exports.getAllPostsOfAdmin = catchAsync(async (req, res, next) => {
  const rows = await poolQuery(
    'SELECT posts.post_id, posts.content, posts.created_at, posts.updated_at, posts.is_deleted, posts.deletedat, posts.user_id, posts.access_range, users.username, users.nickname, users.biography, users.email, users.role, users.avatar_path FROM posts join users on posts.user_id = users.user_id WHERE posts.is_deleted = 0 and users.role = $1 ORDER BY posts.created_at DESC',
    ['admin']
  );

  if (!rows) {
    return next(new AppError('No posts found', 404));
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

exports.getAllMyPosts = catchAsync(async (req, res, next) => {
  const userid = req.userid;
  const rows = await poolQuery(
    'SELECT * FROM posts WHERE is_deleted = 0 and user_id = $1 ORDER BY posts.created_at DESC',
    [userid]
  );

  if (!rows) {
    return next(new AppError('No posts found', 404));
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

exports.getAllPostsExceptCurrentLoggedInUser = catchAsync(
  async (req, res, next) => {
    const { userid } = req.params;
    const rows = await poolQuery(
      'SELECT posts.post_id, posts.content, posts.created_at, posts.updated_at, posts.is_deleted, posts.deletedat, posts.user_id, posts.access_range, users.username, users.nickname, users.biography, users.email, users.role, users.avatar_path FROM posts join users on posts.user_id = users.user_id WHERE posts.is_deleted = 0 and posts.user_id != $1 ORDER BY posts.created_at DESC',
      [userid]
    );

    if (!rows) {
      return next(new AppError('No posts found', 404));
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
  }
);

exports.getLastestPostCreatedByMe = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const rows = await poolQuery(
    // 'SELECT * FROM posts join users on posts.user_id = users.user_id WHERE posts.is_deleted = 0 and posts.user_id = $1 ORDER BY posts.created_at DESC LIMIT 1',
    'SELECT * FROM posts WHERE posts.is_deleted = 0 AND posts.user_id = $1 ORDER BY posts.created_at DESC LIMIT 1',
    [userid]
  );

  if (!rows) {
    return next(new AppError('No posts created by me found', 404));
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

exports.checkPostIsExist = catchAsync(async (req, res, next) => {
  const { postid } = req.params;
  const { post_id } = req.body;

  if (postid) {
    const rows = await poolQuery('select * from posts where post_id LIKE $1', [
      postid,
    ]);

    if (!rows) {
      return next(new AppError('No post found', 404));
    }
    console.log('post exist');
    req.post_id = postid;
    next();
  } else if (post_id) {
    const rows = await poolQuery('select * from posts where post_id LIKE $1', [
      post_id,
    ]);

    if (!rows) {
      return next(new AppError('No post found', 404));
    }
    console.log('post exist');
    req.post_id = post_id;
    next();
  } else {
    return next(new AppError('No post found', 404));
  }
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { postid } = req.params;
  const rows = await poolQuery('select * from posts where post_id LIKE $1', [
    postid,
  ]);

  if (!rows) {
    return next(new AppError('No post found', 404));
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

exports.getPostsByContent = catchAsync(async (req, res, next) => {
  let { content } = req.body;
  let searchContent;
  if (content) {
    searchContent = `%${content}%`;
  }

  const rows = await poolQuery(
    'SELECT * FROM posts WHERE content ILIKE $1 AND is_deleted = 0 ORDER BY created_at DESC',
    [searchContent]
  );

  if (!rows || rows.length === 0) {
    return next(new AppError('No post found', 404));
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

exports.getAllImagesByPostId = catchAsync(async (req, res, next) => {
  const { postid } = req.params;
  console.log('post_id', postid);
  const rows = await poolQuery(
    'Select * from attached_items join posts on attached_items.post_id = posts.post_id where attached_items.post_id LIKE $1',
    [postid]
  );
  if (!rows) {
    return next(new AppError('No attach items found', 404));
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

// Cấu hình Multer để lưu trữ file
// Set the storage engine.
// The destination is the folder you want the uploaded file to be saved.
//  You will have to create the destination folder yourself in the project folder.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'assets/images'));
  },
  filename: async (req, file, cb) => {
    const files = fs.readdirSync(path.join(__dirname, '..', 'assets/images'));
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

    // Thay đổi thông báo lỗi để phù hợp với mã lỗi HTTP hoặc thông báo người dùng
    cb(new AppError('Invalid file type', 400)); // Ví dụ: trả về lỗi HTTP 400
  },
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { content, user_id } = req.body;
  const files = req.files || [];
  const post_id = uuidv4();

  console.log('Received files:', files);

  if (files && files.length > 10) {
    return next(new AppError('Not exceed 10 files per post', 400));
  }

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  // Lưu thông tin bài đăng vào cơ sở dữ liệu
  await poolExecute(
    'INSERT INTO posts(post_id, content, created_at, user_id) VALUES ($1, $2, $3, $4)',
    [post_id, content, currentDateTime, user_id]
  );

  // Chỉ post content mà ko post ảnh
  if (!files || files.length === 0) {
    res.status(200).json({
      status: 'success',
      message: 'create post successfully!',
    });
  }

  req.post_id = post_id;
  if (files) {
    req.files = files;
  }
  next();
});

exports.uploadImages = catchAsync(async (req, res, next) => {
  const post_id = req.post_id;
  const files = req.files;

  console.log('Uploading images for post_id:', post_id);
  console.log('Files:', files);

  const promises = files.map(async (file) => {
    const attached_items_id = uuidv4(); // Tạo attached_items_id mới cho mỗi ảnh
    const attacheditem_path = `/assets/images/${file.filename}`;
    const attachedValues = [
      attached_items_id,
      'file',
      attacheditem_path,
      post_id,
    ];

    // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
    await poolExecute(
      'INSERT INTO attached_items(attached_items_id, attacheditem_type, attacheditem_path, post_id) VALUES ($1, $2, $3, $4)',
      attachedValues
    );
  });

  // Chờ cho tất cả các promise được giải quyết
  await Promise.all(promises);

  res.status(200).json({
    status: 'success',
    message: 'create post and upload images successfully!',
  });
});

// exports.createPost = catchAsync(async (req, res, next) => {
//   const { content, user_id } = req.body;
//   const files = req.files || [];
//   const post_id = uuidv4();

//   if (files && files.length > 10) {
//     return next(new AppError('Not exceed 10 files per post', 400));
//   }

//   const currentDateTime = moment()
//     .tz('Asia/Ho_Chi_Minh')
//     .format('YYYY-MM-DD HH:mm:ss');

//   // Lưu thông tin bài đăng vào cơ sở dữ liệu
//   await poolExecute(
//     'INSERT INTO posts(post_id, content, created_at, user_id) VALUES ($1, $2, $3, $4)',
//     [post_id, content, currentDateTime, user_id]
//   );

//   //Chỉ post content mà ko post ảnh
//   if (!files || files.length === 0) {
//     res.status(200).json({
//       status: 'success',
//       message: 'create post successfully!',
//     });
//   }

//   req.post_id = post_id;
//   if (files) {
//     req.files = files;
//   }
//   next();
// });

// exports.uploadImages = catchAsync(async (req, res, next) => {
//   const post_id = req.post_id;
//   const files = req.files;

//   const promises = files.map(async (file) => {
//     const attached_items_id = uuidv4(); // Tạo attached_items_id mới cho mỗi ảnh
//     const attacheditem_path = `/assets/images/${file.filename}`;
//     const attachedValues = [
//       attached_items_id,
//       'file',
//       attacheditem_path,
//       post_id,
//     ];

//     // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
//     await poolExecute(
//       'INSERT INTO attached_items(attached_items_id, attacheditem_type, attacheditem_path, post_id) VALUES ($1, $2, $3, $4)',
//       attachedValues
//     );
//   });

//   // Chờ cho tất cả các promise được giải quyết
//   await Promise.all(promises);

//   res.status(200).json({
//     status: 'success',
//     message: 'create post and upload images successfully!',
//   });
// });

exports.updatePost = catchAsync(async (req, res, next) => {
  const post_id = req.post_id; //post_id là giá trị được tạo trực tiếp trong quá trình chạy, không phải đối tượng {}
  //Not need to check if post_id is exist because using getPostById before
  const { content } = req.body;

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  await poolExecute(
    'UPDATE posts SET content = $1, updated_at = $2 WHERE post_id = $3',
    [content, currentDateTime, post_id]
  );

  res.status(200).json({
    status: 'success',
    message: 'update post successfully!',
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post_id = req.post_id; //post_id là giá trị được tạo trực tiếp trong quá trình chạy, không phải đối tượng {}
  //Not need to check if post_id is exist because using getPostById before

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  await poolExecute(
    'UPDATE posts SET is_deleted = $1, deletedat = $2 where post_id = $3',
    [1, currentDateTime, post_id]
  );

  res.status(200).json({
    status: 'success',
    message: 'delete post successfully!',
  });
});
