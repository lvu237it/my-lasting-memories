const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log('value', value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((elm) => elm.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpired = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};
const sendErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  // Lỗi hoạt động, đáng tin cậy: gửi thông báo cho client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Lỗi lập trình hoặc lỗi không rõ khác: không tiết lộ chi tiết lỗi

    // 1. Ghi lại lỗi
    console.error('ERROR boomm!', err);

    // 2. Gửi thông báo chung
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Xử lý lỗi cụ thể
  if (err.name === 'CastError') err = handleCastErrorDB(err);

  if (err.code === 11000) {
    err = handleDuplicateFieldsDB(err);
  }

  if (err.name === 'ValidationError') {
    err = handleValidationErrorDB(err);
  }

  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    err = handleJWTExpired();
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
    console.log('error development');
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProduction(err, res);
    console.log('error production');
  }
};
