// https://my-lasting-memories.vercel.app/assets/images/
// Cấu hình đường dẫn xem nội dung các file trong folder
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

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'assets', 'images')); // Đường dẫn tới thư mục lưu trữ
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});

const upload = multer({ storage });

exports.getAllAssetsImages = catchAsync(async (req, res, next) => {
  //Lấy từ database trước
  const rows = await poolQuery(
    // 'select * from attached_items ORDER BY created_at ASC'
    'select * from attached_items'
  );

  if (!rows) {
    return next(new AppError('No images found', 404));
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

exports.getAllAssetsImagesComments = catchAsync(async (req, res, next) => {
  //Lấy từ database trước
  const rows = await poolQuery('select * from attached_items_comments');

  if (!rows) {
    return next(new AppError('No images comments found', 404));
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
