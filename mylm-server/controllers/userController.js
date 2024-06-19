const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const [rows, fields] = await poolQuery('SELECT * FROM users');
  if (!rows) {
    return next(new AppError('No users found', 404));
  }
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: rows.length,
    data: {
      data: rows,
    },
  });
});

exports.findUserByEmail = async (email) => {
  const [rows, fields] = await poolQuery(
    'SELECT * FROM users where users.email = ?',
    [email]
  );
  if (!rows || rows.length === 0) {
    throw new AppError('No users found', 404);
  }
  return rows[0];
};

exports.findUserById = async (user_id) => {
  const [rows, fields] = await poolQuery(
    'SELECT * FROM users where users.user_id = ?',
    [user_id]
  );
  if (!rows || rows.length === 0) {
    throw new AppError('No users found', 404);
  }
  return rows[0];
};
