const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const moment = require('moment-timezone');

// Controller Function
exports.getCurrentLoggedInUserInformation = catchAsync(
  async (req, res, next) => {
    const { role, userid } = req.query;
    if (!role) {
      return next(new AppError('Role parameter is missing', 400));
    }
    const rows = await poolQuery(
      'SELECT * FROM users where role = $1 and user_id = $2',
      [role, userid]
    );
    if (!rows) {
      return next(new AppError('No user found', 404));
    }

    // Lọc các trường cần hiển thị
    const filteredRows = rows.map((row) => ({
      user_id: row.user_id,
      username: row.username,
      email: row.email,
      role: row.role,
      avatar_path: row.avatar_path,
      nickname: row.nickname,
      biography: row.biography,
    }));

    // Response to client
    res.status(200).json(filteredRows);
  }
);

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const rows = await poolQuery('SELECT * FROM users');

  if (!rows || rows.length === 0) {
    return next(new AppError('KHÔNG tìm thấy thông tin người dùng', 404));
  }

  // Lọc các trường cần hiển thị (nếu cần thiết)
  const filteredRows = rows.map((user) => ({
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar_path: user.avatar_path,
    nickname: user.nickname,
    biography: user.biography,
  }));

  // Response to client
  // res.status(200).json({
  //   status: 'success',
  //   results: rows.length,
  //   data: rows,
  // });
  res.status(200).json(filteredRows);
});

exports.getUserByPostId = catchAsync(async (req, res, next) => {
  const post_id = req.post_id;
  const rows = await poolQuery(
    'SELECT * FROM users join posts on posts.user_id = users.user_id and posts.post_id = $1',
    [post_id]
  );
  if (!rows) {
    return next(new AppError('KHÔNG tìm thấy thông tin người dùng', 404));
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

exports.getUserByUserId = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const rows = await poolQuery('select * from users where user_id like $1', [
    userid,
  ]);

  if (!rows) {
    return next(new AppError('No post found', 404));
  }

  res.status(200).json(rows);
});

exports.getUserInformationOfChosenUserProfile = catchAsync(
  async (req, res, next) => {
    const userid = req.userid;
    const rows = await poolQuery('select * from users where user_id like $1', [
      userid,
    ]);

    if (!rows) {
      return next(new AppError('No chosen user found', 404));
    }

    res.status(200).json(rows);
  }
);

exports.checkUserIsExistById = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const rows = await poolQuery('select * from users where user_id like $1', [
    userid,
  ]);

  if (!rows) {
    return next(new AppError('No users found', 404));
  }

  req.userid = userid;
  next();
});

exports.findUserByEmail = async (email) => {
  const rows = await poolQuery('SELECT * FROM users WHERE email like $1', [
    email,
  ]);

  if (!rows || rows.length === 0) {
    throw new AppError('KHÔNG tìm thấy thông tin người dùng', 404);
  } else {
    console.log('user found', rows[0]);
  }

  return rows[0];
};

exports.findUserById = async (user_id) => {
  const rows = await poolQuery('SELECT * FROM users where users.user_id = $1', [
    user_id,
  ]);
  if (!rows || rows.length === 0) {
    throw new AppError('KHÔNG tìm thấy thông tin người dùng', 404);
  }
  return rows[0];
};

exports.updateUserInformation = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const {
    username,
    nickname,
    biography,
    images_only_one,
    avatar_default_path,
  } = req.body;
  // const { user_id,  } = req.body;
  let imageArray;
  if (images_only_one) {
    imageArray = JSON.parse(images_only_one);
  }
  let executeString = 'UPDATE users SET ';
  const params = [];
  let paramIndex = 1; // Biến này sẽ theo dõi chỉ số placeholder

  // Thêm các cột cần cập nhật vào câu lệnh
  if (username !== undefined && username !== '') {
    executeString += `username = $${paramIndex}, `;
    params.push(username);
    paramIndex++;
  }
  if (nickname !== undefined && nickname !== '') {
    executeString += `nickname = $${paramIndex}, `;
    params.push(nickname);
    paramIndex++;
  }
  if (biography !== undefined && biography !== '') {
    executeString += `biography = $${paramIndex}, `;
    params.push(biography);
    paramIndex++;
  }

  if (images_only_one) {
    executeString += `avatar_path = $${paramIndex}, `;
    params.push(imageArray[0]);
    paramIndex++;
  }

  if (avatar_default_path) {
    executeString += `avatar_path = $${paramIndex}, `;
    params.push(avatar_default_path);
    paramIndex++;
  }

  // Kiểm tra nếu không có cột nào để cập nhật
  if (params.length === 0) {
    return next(new AppError('No valid fields to update', 400));
  }

  // Xóa dấu phẩy cuối cùng và thêm điều kiện WHERE
  executeString = executeString.replace(/, $/, ''); // Loại bỏ dấu phẩy cuối cùng
  executeString += ` WHERE user_id = $${paramIndex}`;
  params.push(userid);

  // Thực thi câu lệnh
  await poolExecute(executeString, params);

  res.status(200).json({
    status: 'success',
    message: 'Update user information successfully!',
  });
});

exports.deleteAvatar = catchAsync(async (req, res, next) => {
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
