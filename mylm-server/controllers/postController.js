const cloudinary = require('cloudinary').v2;
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

const uploadToCloudinary = (fileBuffer, postId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'images',
        public_id: `images/${postId}/${uuidv4()}`,
        resource_type: 'image',
        // upload_preset: 'my_lasting_memories_2307_images',
      },
      (error, result) => {
        if (error) {
          reject(new AppError('Error uploading to Cloudinary', 500));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

//Get existed posts (EXCEPT deleted posts)
exports.getAllPostsOfAdminPublic = catchAsync(async (req, res, next) => {
  const rows = await poolQuery(
    'SELECT posts.post_id, posts.content, posts.created_at, posts.updated_at, posts.is_deleted, posts.deletedat, posts.user_id, posts.access_range, users.username, users.nickname, users.biography, users.email, users.role, users.avatar_path FROM posts join users on posts.user_id = users.user_id WHERE posts.is_deleted = 0 and users.role = $1 and posts.access_range = $2 ORDER BY posts.created_at DESC',
    ['admin', 'public']
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

//Get all posts of admin (private and public)
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

exports.getAllPostsOfChosenUserProfile = catchAsync(async (req, res, next) => {
  const userid = req.userid;
  const rows = await poolQuery(
    'SELECT * FROM posts WHERE is_deleted = 0 and user_id = $1 and access_range = $2 ORDER BY posts.created_at DESC',
    [userid, 'public']
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

exports.getAllPostsOfAdminAndExceptCurrentLoggedInUser = catchAsync(
  async (req, res, next) => {
    const { userid } = req.params;
    //posts except me
    const rows = await poolQuery(
      'SELECT posts.post_id, posts.content, posts.created_at, posts.updated_at, posts.is_deleted, posts.deletedat, posts.user_id, posts.access_range, users.username, users.nickname, users.biography, users.email, users.role, users.avatar_path FROM posts join users on posts.user_id = users.user_id WHERE posts.is_deleted = 0 and posts.user_id != $1 and posts.access_range = $2 ORDER BY posts.created_at DESC',
      [userid, 'public']
    );

    //posts of admin
    const rows2 = await poolQuery(
      'SELECT posts.post_id, posts.content, posts.created_at, posts.updated_at, posts.is_deleted, posts.deletedat, posts.user_id, posts.access_range, users.username, users.nickname, users.biography, users.email, users.role, users.avatar_path FROM posts join users on posts.user_id = users.user_id WHERE posts.is_deleted = 0 and users.role = $1 ORDER BY posts.created_at DESC',
      ['admin']
    );

    const combinedRows = [...rows, ...rows2];
    const seen = new Set();
    const uniqueCombinedRows = combinedRows.filter((row) => {
      const duplicate = seen.has(row.post_id);
      seen.add(row.post_id);
      return !duplicate;
    });

    if (!uniqueCombinedRows) {
      return next(new AppError('No posts except me and admin found', 404));
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
    res.status(200).json(uniqueCombinedRows);
  }
);

exports.getAllPostsExceptCurrentLoggedInUser = catchAsync(
  async (req, res, next) => {
    const { userid } = req.params;
    const rows = await poolQuery(
      'SELECT posts.post_id, posts.content, posts.created_at, posts.updated_at, posts.is_deleted, posts.deletedat, posts.user_id, posts.access_range, users.username, users.nickname, users.biography, users.email, users.role, users.avatar_path FROM posts join users on posts.user_id = users.user_id WHERE posts.is_deleted = 0 and posts.user_id != $1 and posts.access_range = $2 ORDER BY posts.created_at DESC',
      [userid, 'public']
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

exports.getCurrentStatusOfChosenPost = catchAsync(async (req, res, next) => {
  const post_id = req.post_id;

  const rows = await poolQuery(
    'SELECT access_range FROM posts WHERE post_id = $1',
    [post_id]
  );

  if (!rows) {
    return next(new AppError('No post found', 404));
  }
  res.status(200).json(rows);
});

exports.updateCurrentStatusOfChosenPost = catchAsync(async (req, res, next) => {
  const post_id = req.post_id;
  const { access_range } = req.body;

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  const rows = await poolQuery(
    'Update posts SET access_range = $1, updated_at = $2 WHERE post_id = $3',
    [access_range, currentDateTime, post_id]
  );

  if (!rows) {
    return next(new AppError('No post found', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'update post status successfully!',
  });
});

exports.checkPostIsExist = catchAsync(async (req, res, next) => {
  const { postid } = req.params;
  const { post_id } = req.body;
  // console.log('postid', postid);
  // console.log('post_id', post_id);
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
  const post_id = req.post_id;
  const rows = await poolQuery(
    'select * from posts where post_id LIKE $1 and is_deleted = 0',
    [post_id]
  );

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
    'SELECT * FROM posts WHERE content ILIKE $1 AND is_deleted = 0 and access_range = $2 ORDER BY created_at DESC',
    [searchContent, 'public']
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

exports.getPostsByContentAndAllOfAdminPosts = catchAsync(
  async (req, res, next) => {
    let { content } = req.body;
    let searchContent;
    if (content) {
      searchContent = `%${content}%`;
    }

    const rows = await poolQuery(
      'SELECT * FROM posts WHERE content ILIKE $1 AND is_deleted = 0 and access_range = $2 ORDER BY created_at DESC',
      [searchContent, 'public']
    );

    const rows2 = await poolQuery(
      'SELECT posts.* FROM posts join users on posts.user_id = users.user_id WHERE content ILIKE $1 AND is_deleted = 0 AND users.role = $2 ORDER BY created_at DESC',
      [searchContent, 'admin']
    );

    const combinedRows = [...rows, ...rows2];

    const uniqueCombinedRows = combinedRows.reduce((acc, current) => {
      if (!acc.some((row) => row.post_id === current.post_id)) {
        acc.push(current);
      }
      return acc;
    }, []);

    if (!uniqueCombinedRows || uniqueCombinedRows.length === 0) {
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
    res.status(200).json(uniqueCombinedRows);
  }
);

exports.getPostsByContentOnlyAdmin = catchAsync(async (req, res, next) => {
  let { content } = req.body;
  let searchContent;
  if (content) {
    searchContent = `%${content}%`;
  }

  const rows = await poolQuery(
    'SELECT posts.* FROM posts join users on posts.user_id = users.user_id WHERE content ILIKE $1 AND is_deleted = 0 and access_range = $2 and users.role = $3 ORDER BY created_at DESC',
    [searchContent, 'public', 'admin']
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
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '..', 'assets/images'));
//   },
//   filename: async (req, file, cb) => {
//     const files = fs.readdirSync(path.join(__dirname, '..', 'assets/images'));
//     const originalname = file.originalname;

//     // Kiểm tra xem tên file đã tồn tại trong thư mục hay chưa
//     // Đọc danh sách các file trong thư mục assets/images.
//     if (files.includes(originalname)) {
//       console.log(`File ${originalname} đã tồn tại, bỏ qua upload.`);
//       cb(null, originalname); // Nếu file đã tồn tại, không thay đổi tên file
//     } else {
//       cb(null, Date.now() + '-' + originalname); // Nếu file chưa tồn tại, thực hiện upload bình thường
//     }
//   },
// });

// Set up multer instance
// Limit is by default set to 1mb but using the limit property we can set it to 10MB
// exports.upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );

//     const mimetype = allowedTypes.test(file.mimetype);
//     if (mimetype && extname) {
//       return cb(null, true);
//     }

//     // Thay đổi thông báo lỗi để phù hợp với mã lỗi HTTP hoặc thông báo người dùng
//     cb(new AppError('Invalid file type', 400)); // Ví dụ: trả về lỗi HTTP 400
//   },
// });

// Set up multer storage using memory storage
// const storage = multer.memoryStorage();

// Set up multer instance
// exports.upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = allowedTypes.test(file.mimetype);
//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new AppError('Invalid file type', 400));
//   },
// });

exports.createPost = catchAsync(async (req, res, next) => {
  const { content, user_id, images_array } = req.body;

  // const files = req.files || [];
  const post_id = uuidv4();
  const imageArray = JSON.parse(images_array);
  // Xử lý các giá trị null hoặc undefined

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  // Lưu thông tin bài đăng vào cơ sở dữ liệu
  await poolExecute(
    'INSERT INTO posts(post_id, content, created_at, updated_at, user_id, access_range) VALUES ($1, $2, $3, $4, $5, $6)',
    [post_id, content, currentDateTime, currentDateTime, user_id, 'public']
  );

  // Chỉ post content mà ko post ảnh
  if (!imageArray || imageArray.length === 0) {
    res.status(200).json({
      status: 'success',
      message: 'create post successfully!',
    });
  }

  req.post_id = post_id;
  if (imageArray) {
    req.imageArray = imageArray;
  }
  next();
});

//lưu thông tin vào database
exports.uploadImages = catchAsync(async (req, res, next) => {
  const post_id = req.post_id;
  const imageArray = req.imageArray;

  console.log('Uploading imageArray for post_id:', post_id);
  console.log('Immages:', imageArray);

  // ------------------ Uploads lên database ---------------------------

  try {
    const uploadPromises = imageArray.map(async (imageUrl) => {
      const attached_items_id = uuidv4();
      const attacheditem_path = imageUrl; // URL ảnh

      const attachedValues = [
        attached_items_id,
        'image', // Hoặc 'file' nếu bạn muốn giữ 'file' cho mọi loại tệp
        attacheditem_path,
        post_id,
      ];

      // Thực hiện câu lệnh INSERT vào bảng attached_items
      await poolExecute(
        'INSERT INTO attached_items (attached_items_id, attacheditem_type, attacheditem_path, post_id) VALUES ($1, $2, $3, $4)',
        attachedValues
      );
    });

    // Chờ tất cả các câu lệnh INSERT hoàn tất
    await Promise.all(uploadPromises);

    res.status(200).json({
      status: 'success',
      message: 'Create post and upload images successfully!',
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload images.',
    });
  }
});

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
    'UPDATE posts SET is_deleted = $1, deletedat = $2, updated_at = $3 where post_id = $4',
    [1, currentDateTime, currentDateTime, post_id]
  );

  res.status(200).json({
    status: 'success',
    message: 'delete post successfully!',
  });
});

exports.getSavedPostByPostIdAndSaverId = catchAsync(async (req, res, next) => {
  const { postid } = req.params;
  const { author_user_id, saver_user_id } = req.query;

  const rows = await poolQuery(
    'select * from saved_posts join posts on saved_posts.post_id = posts.post_id where saved_posts.post_id = $1 and saved_posts.author_user_id = $2 and saved_posts.saver_user_id = $3 and saved_posts.is_deleted = 0 and posts.is_deleted = 0',
    [postid, author_user_id, saver_user_id]
  );

  if (!rows) {
    return next(new AppError('No saved post found', 404));
  }

  res.status(200).json(rows);
});

exports.getAllMySavedPosts = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const rows = await poolQuery(
    'select saved_posts.*, posts.* from saved_posts join posts on saved_posts.post_id = posts.post_id where saved_posts.saver_user_id = $1 and saved_posts.is_deleted = 0 and posts.is_deleted = 0 order by posts.created_at desc',
    [userid]
  );

  if (!rows) {
    return next(new AppError('No saved post found', 404));
  }

  res.status(200).json(rows);
});

exports.createSavedPost = catchAsync(async (req, res, next) => {
  const post_id = req.post_id;
  const { saver_user_id, author_user_id } = req.body;

  const saved_post_id = uuidv4();
  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  // Lưu thông tin bài đăng vào cơ sở dữ liệu
  await poolExecute(
    'INSERT INTO saved_posts(saved_post_id, created_at, saver_user_id, post_id, author_user_id) VALUES ($1, $2, $3, $4, $5)',
    [saved_post_id, currentDateTime, saver_user_id, post_id, author_user_id]
  );

  res.status(200).json({
    status: 'success',
    message: 'create saved post successfully!',
  });
});

exports.deleteSavedPost = catchAsync(async (req, res, next) => {
  const post_id = req.post_id;
  const { saver_user_id, author_user_id } = req.body;

  const currentDateTime = moment()
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD HH:mm:ss');

  await poolExecute(
    'UPDATE saved_posts SET is_deleted = $1, deletedat = $2 where post_id = $3 and saver_user_id = $4 and author_user_id = $5 and is_deleted = 0',
    [1, currentDateTime, post_id, saver_user_id, author_user_id]
  );

  res.status(200).json({
    status: 'success',
    message: 'delete saved post successfully!',
  });
});
