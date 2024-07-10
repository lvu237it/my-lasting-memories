const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const rateLimit = require('express-rate-limit'); //cấu hình giới hạn số lượng request từ client - 1 IP hoặc 1 user có thể gửi trong 1 khoảng thời gian nhất định
const helmet = require('helmet'); // mũ bảo hiểm (helmet) là tập hợp của nhiều middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');
const mysql = require('mysql2');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Import routers
//using this below like a middleware
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');

// 1) GLOBAL MIDDLEWARE
//Setting Security Http Headers

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//Cross-Origin Resource Sharing
//CORS là cơ chế cho phép các tài nguyên trên một trang web được yêu cầu từ một tên miền khác với tên miền mà tài nguyên đó được lưu trữ.
//Đây là một tính năng bảo mật của các trình duyệt để ngăn chặn các trang web khác nhau truy cập vào các tài nguyên của nhau mà không có sự cho phép.
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend và Backend URLs
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'], //Chỉ định các header được cho phép trong request - Nếu ko cần header cụ thể có thể bỏ qua
    credentials: true, // Nếu bạn cần hỗ trợ phiên đăng nhập hoặc sử dụng cookies
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files từ thư mục assets
app.use(
  '/assets/images',
  express.static(path.join(__dirname, 'assets/images'), { fallthrough: false })
);
//Điều này sẽ cho phép các tệp tĩnh trong thư mục assets của bạn có thể được truy cập từ frontend thông qua đường dẫn /assets.
//Ví dụ, nếu bạn có một hình ảnh logo.png trong assets/images, bạn có thể truy cập nó qua đường dẫn http://localhost:5173/assets/images/logo.png

//Development logging
if (process.env.NODE_ENV === 'development') {
  //việc đọc các biến môi trường từ file .env xảy ra duy nhất
  //1 lần, sau đó nó nằm trong process và có thể truy cập ở tất cả mọi nơi

  //morgan: using 3rd-party middleware
  app.use(morgan('dev')); // van la 1 chuc nang phan mem trung gian (middleware)
}

//limit requests from same API
//Có thể xác định số lượng yêu cầu trên mỗi IP mà chúng ta sẽ cho phép trong 1 khoảng tg nhất định
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 3600s <=> 3600000ms
  //tối đa 100 request trên 1 giờ
  message: 'Too many requests from this IP, please try again in an hour!',
});
// app.use('/api', limiter); //Chỉ giới hạn request đối với những đường dẫn bắt đầu bằng /api
// app.use(limiter); //Áp dụng rate limiting cho tất cả các request bằng mọi đường dẫn

//Data sanitization against XSS
app.use(xss());
//Prevent parameter pollution
// app.use(
//   hpp({
//     //cho phép 1 danh sách trắng, bao gồm các chuỗi khi query được phép trùng lặp
//     whitelist:
//       //Ví dụ: /duration=5&duration=9
//       [
//         'duration',
//         'ratingsAverage',
//         'ratingsQuantity',
//         'difficulty',
//         'maxGroupSize',
//         'price',
//       ],
//   })
// );

// 2) ROUTING HANDLERS
//Routing for each HTTP requests
//Users
app.use('/users', userRouter);
//Posts
app.use('/posts', postRouter);

// Handle other routers that do NOT match with any declared routers before
/*
Middleware app.all('*', ...) trong Express 
được định nghĩa để xử lý tất cả các request 
không khớp với bất kỳ route nào đã được định nghĩa
trước đó. 
*/
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/*
   vấn đề liên quan đến thứ tự thực hiện các middleware và routing trong quá trình xử lý request - response trong ứng dụng Express. Cụ thể hơn:

   1. Middleware và Routing: Express xử lý các middleware và routes theo thứ tự mà chúng được định nghĩa trong mã nguồn. Khi một request được gửi đến server, Express sẽ đi qua từng middleware và route theo thứ tự này cho đến khi tìm thấy một middleware hoặc route phù hợp.
   2. Kết thúc chu trình request - response: Khi một route hoặc middleware gọi res.send(), res.end(), hoặc một phương thức tương tự để kết thúc response, chu trình request - response sẽ kết thúc tại đó và bất kỳ middleware nào định nghĩa sau đó sẽ không được thực thi cho request hiện tại.
   */

//xây dựng middleware xử lý lỗi global
app.use(globalErrorHandler);

// 3) START SERVER
module.exports = app;
