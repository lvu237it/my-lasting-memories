const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

exports.getAdminInformation = catchAsync(async (req, res, next) => {
  const rows = await poolQuery(`SELECT * FROM users where role = 'admin'`);
  if (!rows) {
    return next(new AppError('No admin found', 404));
  }

  // Lọc các trường cần hiển thị
  const filteredRows = rows.map((row) => ({
    user_id: row.user_id,
    username: row.username,
    email: row.email,
    role: row.role,
    avatar_path: row.avatar_path,
  }));

  // Response to client
  res.status(200).json(filteredRows);
});
