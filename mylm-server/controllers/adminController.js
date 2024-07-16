const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

exports.getAdminInformation = catchAsync(async (req, res, next) => {
  const [rows, fields] = await poolQuery(
    'SELECT * FROM users where role = "admin"'
  );
  if (!rows) {
    return next(new AppError('No admin found', 404));
  }

  // Lọc các trường cần hiển thị
  const filteredRows = rows.map((admin) => ({
    user_id: admin.user_id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    avatar_path: admin.avatar_path,
  }));

  //Test API using Postman
  // res.status(200).json({
  //   status: 'success',
  //   // requestedAt: req.requestTime,
  //   results: rows.length,
  //   data: {
  //     data: rows,
  //   },
  // });

  //Response to client
  res.status(200).json(filteredRows);
});
