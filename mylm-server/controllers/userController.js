const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

// Controller Function
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
    'SELECT * FROM users join posts where posts.user_id = users.user_id and posts.post_id = $1',
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

exports.checkUserIsExistById = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const rows = await poolQuery('select * from users where user_id like $1', [
    userid,
  ]);

  if (!rows) {
    return next(new AppError('No post found', 404));
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
