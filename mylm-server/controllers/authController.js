const { poolQuery, poolExecute } = require('../database/connection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const userController = require('./userController');
const sendEmail = require('../utils/email');

const singToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); //sign(payload, secretkey, expire)
};

//Gửi lại token cho user
const createSendToken = (user, statusCode, res) => {
  const token = singToken(user.user_id);
  const cookieOptions = {
    expires: new Date(
      //Chuyển thành mili giây
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //làm cho trình duyệt ko thể truy cập hoặc sửa đổi cookie theo bất kì cách nào
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  //Tạo và gửi cookie
  res.cookie('jwt', token, cookieOptions);

  //Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Kiểm tra sự tồn tại của email và password
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 12);

  const user_id = uuidv4();
  const newUser = await poolExecute(
    'INSERT INTO users(user_id, username, email, password, role) VALUES (?,?,?,?,?)',
    [user_id, username, email, hashedPassword, role]
  );

  createSendToken({ user_id, username, email }, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2. Check if user exists && password is correct
  try {
    const user = await userController.findUserByEmail(email);
    if (!user) {
      return next(new AppError('User undefined', 404));
    }
    const passwordComparing = !(await correctPassword(password, user.password));
    if (!user || passwordComparing) {
      console.log('passwordComparing', passwordComparing);
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3. If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    return next(new AppError('Error finding user', 500));
  }
});

const correctPassword = async function (candidatePassword, userPassword) {
  // console.log('candidatePassword vs userPassword');
  // console.log('candidatePassword: ' + candidatePassword);
  // console.log('userPassword: ' + userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

const changedPasswordAfter = (JWTTimestamp) => {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(
      'thoi gian thay doi pass: ' + changedTimestamp,
      'thoi gian expire jwt: ' + JWTTimestamp
    );
    return changedTimestamp > JWTTimestamp;
    //Nếu thời gian thay đổi mật khẩu lớn hơn thời gian phát hành JWT,
    //trả về true, nghĩa là mật khẩu đã được thay đổi
    //sau khi JWT được phát hành và JWT này nên bị coi là không hợp lệ.
  }
  //False means not changed
  return false;
};

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check of it's there - Lấy token và kiểm tra sự tồn tại của nó
  // kiểm tra xem có token trong headers của request hay không.
  let token;
  if (
    //Tạo ra điều kiện để kiểm tra rằng user có được quyền truy cập và xem all tours hay không
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  //2. Verification token - Xác minh token
  //destructuring promisify của node và sử dụng như promise
  //vì .verify là hàm synchronous nên nó cần được parse thành 1 promise thì mới có thể sử dụng await
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //3. Check if user still exists - Kiểm tra sự tồn tại của người dùng
  // Kiểm tra người dùng từ mã đã được decode

  const currentUser = await userController.findUserById(decoded.id);
  if (!currentUser) {
    //Không tìm thấy - ko còn tồn tại người dùng của jwt đó
    return next(
      new AppError(
        'The token belonging to this user does no longer exist.',
        401
      )
    );
  }

  //Kiểm tra liệu password có thay đổi sau khi JWT được phát hành
  // 4. Check if user changed password after the token was issued
  if (changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  //Grant access to protected route - cấp quyền truy cập vào tuyến đường được bảo vệ
  req.user = currentUser; //tạo thêm thuộc tính user cho request object
  //gán thông tin người dùng hiện tại (currentUser) vào đối tượng req (request)
  //để các middleware và route handler tiếp theo có thể truy cập thông tin của người dùng đã xác thực.
  next();
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
  const user = await userController.findUserById(req.user.user_id);
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;
  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return next(
      new AppError('Current password and new password are required', 404)
    );
  }

  //Comparing current input password to user's password in database
  const passwordComparing = await correctPassword(
    currentPassword,
    user.password
  );
  if (!passwordComparing) {
    return next(new AppError('Your current password is wrong', 401));
  }
  if (newPassword !== newPasswordConfirm) {
    return next(
      new AppError('New password does NOT match with new password confirm', 401)
    );
  }

  //Old password is true, then update password
  // Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const [result] = await poolExecute(
    'UPDATE users SET password = ? where users.user_id = ? ',
    [hashedPassword, req.user.user_id]
  );
  res.status(200).json({
    status: 'success',
    results: result,
  });
});

//restrictTo là một hàm nhận tham số role và trả về một hàm middleware chuẩn.
exports.restrictTo = (...roles) => {
  /*
    trong Express.js hoặc các framework tương tự, 
    middleware là các hàm xử lý yêu cầu và phản hồi. 
    Khi bạn muốn truyền tham số vào middleware, 
    bạn cần sử dụng một kỹ thuật gọi là "bao đóng" (closure) 
    để tạo ra một hàm trung gian. Đây là cách duy nhất để 
    middleware nhận tham số ngoài các 
    đối số tiêu chuẩn (req, res, next).
  */
  //phần closure (bao đóng) - trả về 1 hàm mới từ hàm ban đầu
  //Closure có thể cho phép "nhớ" các biến ở phạm vi ngoài (trong TH này là roles) ngay cả khi hàm bên ngoài đã thực thi xong
  return (req, res, next) => {
    //Roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return { resetToken, passwordResetToken, passwordResetExpires };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await userController.findUserByEmail(req.body.email);
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  const { resetToken, passwordResetToken, passwordResetExpires } =
    createPasswordResetToken();

  await poolExecute(
    'UPDATE users SET passwordResetToken = ?, passwordResetExpires = ? WHERE user_id = ?',
    [passwordResetToken, new Date(passwordResetExpires), user.user_id]
  );

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    await poolExecute(
      'UPDATE users SET passwordResetToken = ?, passwordResetExpires = ? WHERE user_id = ?',
      [null, null, user.user_id]
    );

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return next(
      new AppError('Password does NOT match with password confirm', 401)
    );
  }

  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const [rows] = await poolQuery(
    'SELECT * FROM users WHERE passwordResetToken = ? AND passwordResetExpires > ?',
    [hashedToken, new Date()]
  );

  const user = rows[0];

  // 2. If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  const newPassword = await bcrypt.hash(password, 12);

  await poolExecute(
    'UPDATE users SET password = ?, passwordResetToken = ?, passwordResetExpires = ? WHERE user_id = ?',
    [newPassword, null, null, user.user_id]
  );

  // 3. Update changedPasswordAt property for the user
  // 4. Log the user in, send JWT
  createSendToken(user, 200, res);
});
