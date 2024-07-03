const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const userController = require('./userController');
const moment = require('moment-timezone');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const [rows, fields] = await poolQuery(
    'select * from posts order by created_at desc'
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

exports.checkPostIsExist = catchAsync(async (req, res, next) => {
  const { postid } = req.params;
  const [rows, fields] = await poolQuery(
    'select * from posts where post_id = ?',
    [postid]
  );

  if (!rows) {
    return next(new AppError('No post found', 404));
  }

  req.post_id = postid;
  next();
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { postid } = req.params;
  const [rows, fields] = await poolQuery(
    'select * from posts where post_id = ?',
    [postid]
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

exports.createPost = catchAsync(async (req, res, next) => {
  const { content, user_id } = req.body;
  const post_id = uuidv4();

  await poolExecute(
    'INSERT INTO posts(post_id, content, user_id) VALUES (?,?,?)',
    [post_id, content, user_id]
  );

  res.status(200).json({
    status: 'success',
    message: 'create post successfully!',
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post_id = req.post_id; //post_id là giá trị được tạo trực tiếp trong quá trình chạy, không phải đối tượng {}
  //Not need to check if post_id is exist because using getPostById before
  const { content } = req.body;

  await poolExecute('UPDATE posts SET content = ? where post_id = ?', [
    content,
    post_id,
  ]);

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
    'UPDATE posts SET is_deleted = ?, deletedAt = ? where post_id = ?',
    [true, currentDateTime, post_id]
  );

  res.status(200).json({
    status: 'success',
    message: 'delete post successfully!',
  });
});
