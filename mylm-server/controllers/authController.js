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

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
  // path: path.join(__dirname, '.env'), // Sử dụng path.join để nối đường dẫn
  path: `${__dirname}/../.env`, // Sử dụng path.join để nối đường dẫn
});

const singToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); //sign(payload, secretkey, expire)
};

//Gửi lại token cho user
const createSendToken = (user, statusCode, res) => {
  const token = singToken(user.user_id);
  // ------------------Có Cookies nếu có Chức năng Remember Me------------------
  // const cookieOptions = {
  //   expires: new Date(
  //     //Chuyển thành mili giây
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true, //làm cho trình duyệt ko thể truy cập hoặc sửa đổi cookie theo bất kì cách nào
  // };

  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true;
  // }
  // //Tạo và gửi cookie
  // res.cookie('jwt', token, cookieOptions);

  // //Remove password from output
  // user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  //Kiểm tra username
  if (!username.match(/^[a-zA-Z\s]+$/)) {
    return next(
      new AppError(
        // 'User name only contain alphabets characters and spaces',
        'Họ và Tên chỉ chứa kí tự alphabet và khoảng trắng',
        400
      )
    );
  }

  // Kiểm tra sự tồn tại của email và password
  if (!email || !password) {
    return next(new AppError('Vui lòng cung cấp email và mật khẩu', 400));
  }

  // kiểm tra email tồn tại hay chưa
  const isEmailExisted = await this.checkExistedUserByEmail(email);
  if (isEmailExisted) {
    return next(new AppError('Email đã tồn tại', 409));
  }

  if (
    !email.match(
      /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/
    )
  ) {
    // return next(new AppError('Invalid email format', 400));
    return next(new AppError('Email không hợp lệ', 400));
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 12);

  const user_id = uuidv4();
  const newUser = await poolExecute(
    'INSERT INTO users(user_id, username, email, password) VALUES ($1,$2,$3,$4)',
    [user_id, username, email, hashedPassword]
  );

  createSendToken({ user_id, username, email }, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, rememberMe } = req.body;
  const rememberMeFinal = rememberMe || false;
  //1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Vui lòng cung cấp email và mật khẩu', 400));
  }

  // 2. Check if user exists && password is correct
  const user = await userController.findUserByEmail(email);
  if (!user) {
    return next(new AppError('Người dùng không xác định', 404));
  } else {
    const passwordComparing = await correctPassword(password, user.password);
    console.log('passwordComparing', passwordComparing);
    if (passwordComparing === false) {
      console.log('passwordComparing', passwordComparing);
      return next(new AppError('Email hoặc mật khẩu không đúng', 401));
    } else {
      // 3. Handle RememberMe logic
      //lưu trữ thông tin quan trọng liên quan tới ghi nhớ phiên đăng nhập của user
      if (rememberMeFinal === true) {
        const series = crypto.randomBytes(16).toString('hex'); //series identifier
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
          .createHash('sha256')
          .update(token)
          .digest('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const rememberId = uuidv4();
        //kiểm tra xem thông tin của remember_me_tokens ứng với user_id, trước đó có tồn tại chưa
        //Nếu có thì ghi đè lên thông tin cũ - đồng nghĩa với việc update thông tin mới, cụ thể là update [series, token, expires_at]
        if (this.checkExistedRememberUser(user.user_id)) {
          await poolExecute(
            'UPDATE remember_me_tokens SET series = $1, token = $2, expires_at = $3',
            [series, hashedToken, expiresAt]
          );
          console.log('User này đã từng ghi nhớ phiên đăng nhập');
        } else {
          //Nếu chưa từng tồn tại user_id với token ghi nhớ đăng nhập thì tạo mới
          // Lưu thông tin vào bảng remember_me_tokens
          await poolExecute(
            'INSERT INTO remember_me_tokens (id, user_id, series, token, expires_at) VALUES ($1, $2, $3, $4, $5)',
            [rememberId, user.user_id, series, hashedToken, expiresAt]
          );
        }
        // Đặt cookie Remember Me
        const cookieOptions = {
          httpOnly: false,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        };
        if (process.env.NODE_ENV === 'production') {
          cookieOptions.secure = true; // Chỉ sử dụng cookie bảo mật trong môi trường production
        }
        res.cookie('remember_me', `${series}:${token}`, cookieOptions);
      }

      // 4. If everything ok, send token to client
      createSendToken(user, 200, res);
    }
  }
});

//kiểm tra trước đó đã từng ghi nhớ phiên đăng nhập của user trên trình duyệt (form login) hay chưa
exports.checkRememberMe = async (req, res, next) => {
  if (req.cookies.remember_me) {
    const [series, token] = req.cookies.remember_me.split(':');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const rows = await poolExecute(
      'SELECT * FROM remember_me_tokens WHERE series = $1 AND token = $2 AND expires_at > NOW()',
      [series, hashedToken]
    );

    //Có tồn tại phiên đăng nhập trước đó - vẫn còn hiệu lực
    if (rows.length > 0) {
      // const user = await poolExecute('SELECT * FROM users WHERE user_id = ?', [
      //   rows[0].user_id,
      // ]);
      // req.user = user[0];
      // Giữ trạng thái đăng nhập và tiếp tục xử lý request
      res.status(200).json({
        status: 'success',
        message: 'Is logged and not expire',
      });
    }
  } else {
    // Nếu không có cookie Remember Me, chuyển hướng đến trang đăng nhập

    //Phiên đăng nhập đã hết hạn hoặc chưa từng đăng nhập
    // Nếu không tìm thấy hoặc cookie đã hết hạn, xóa cookie và chuyển hướng đến trang đăng nhập
    res.clearCookie('remember_me');
    res.status(200).json({
      status: 'success',
      message: 'Chưa từng có cookie - chuyển hướng tới trang đăng nhập',
    });
  }
  // // Tạo mới token và cập nhật lại trong cơ sở dữ liệu
  // const newToken = crypto.randomBytes(32).toString('hex');
  // const newHashedToken = crypto
  //   .createHash('sha256')
  //   .update(newToken)
  //   .digest('hex');
  // const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // await poolExecute(
  //   'UPDATE remember_me_tokens SET token = ?, expires_at = ? WHERE series = ?',
  //   [newHashedToken, newExpiresAt, series]
  // );

  // // Đặt lại cookie Remember Me với token mới
  // res.cookie('remember_me', `${series}:${newToken}`, {
  //   httpOnly: true,
  //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  //   secure: process.env.NODE_ENV === 'production', // Đảm bảo cookie được truyền qua kết nối HTTPS
  // });
};

//So sánh input password và password trong database
const correctPassword = async function (candidatePassword, userPassword) {
  // console.log('candidatePassword vs userPassword');
  // console.log('candidatePassword: ' + candidatePassword);
  // console.log('userPassword: ' + userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

//Kiểm tra password có bị thay đổi sau khi tạo token hay không
//Nếu có => cần tạo token mới dựa vào password mới thay đổi
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
      new AppError(
        'Bạn chưa đăng nhập! Vui lòng đăng nhập để có quyền truy cập vào tính năng này.',
        401
      )
    );
  }
  //2. Verification token - Xác minh token
  //destructuring promisify của node và sử dụng như promise
  //vì .verify là hàm synchronous nên nó cần được parse thành 1 promise thì mới có thể sử dụng await
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded', decoded);
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
      // new AppError('Current password and new password are required', 404)
      new AppError('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới', 404)
    );
  }

  //Comparing current input password to user's password in database
  const passwordComparing = await correctPassword(
    currentPassword,
    user.password
  );
  if (!passwordComparing) {
    // return next(new AppError('Your current password is wrong', 401));
    return next(new AppError('Mật khẩu hiện tại của bạn không đúng', 401));
  }
  if (newPassword !== newPasswordConfirm) {
    return next(
      // new AppError('New password does NOT match with new password confirm', 401)
      new AppError('Xác nhận mật khẩu mới KHÔNG trùng khớp', 401)
    );
  }

  //Old password is true, then update password
  // Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const [result] = await poolExecute(
    'UPDATE users SET password = $1 where users.user_id = $2',
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
  const { email } = req.body;
  const user = await userController.findUserByEmail(email);
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  const { resetToken, passwordResetToken, passwordResetExpires } =
    createPasswordResetToken();

  await poolExecute(
    'UPDATE users SET passwordResetToken = $1, passwordResetExpires = $2 WHERE user_id = $3',
    [passwordResetToken, new Date(passwordResetExpires), user.user_id]
  );

  //------------Đường dẫn này là 'patch' - dùng để test API reset password
  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/users/resetPassword/${resetToken}`;

  //------------Đường dẫn này là 'get' - dùng để gửi trực tiếp cho users và routing tới trang reset password
  const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  const resetURL = `${frontendUrl}/resetpassword/${resetToken}`;

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
      'UPDATE users SET passwordResetToken = $1, passwordResetExpires = $2 WHERE user_id = $3',
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

exports.verifyResetToken = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  console.log('resetToken in verifyResetToken', token);

  // 1. Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const rows = await poolQuery(
    'SELECT * FROM users WHERE passwordResetToken = $1 AND passwordResetExpires > $2',
    [hashedToken, new Date()]
  );

  const user = rows[0];
  console.log('user by token? ', user);

  // Token invalid or expired
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const { token } = req.params;

  if (password !== passwordConfirm) {
    return next(
      new AppError('Password does NOT match with password confirm', 401)
    );
  }

  // 1. Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const rows = await poolQuery(
    'SELECT * FROM users WHERE passwordResetToken = $1 AND passwordResetExpires > $2',
    [hashedToken, new Date()]
  );

  const user = rows[0];

  const newPassword = await bcrypt.hash(password, 12);

  await poolExecute(
    'UPDATE users SET password = $1, passwordResetToken = $2, passwordResetExpires = $3 WHERE user_id = $4',
    [newPassword, null, null, user.user_id]
  );

  // 3. Update changedPasswordAt property for the user
  // 4. Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.checkExistedUserByEmail = async (email) => {
  const rows = await poolQuery('SELECT * FROM users where users.email = $1', [
    email,
  ]);
  if (!rows || rows.length === 0) {
    return false;
  }
  return true;
};

exports.checkExistedRememberUser = async (user_id) => {
  const rows = await poolQuery(
    'SELECT * FROM remember_me_tokens where user_id = $1',
    [user_id]
  );
  if (!rows || rows.length === 0) {
    return false;
  }
  return true;
};
