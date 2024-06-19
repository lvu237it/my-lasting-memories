const mysql = require('mysql2');
const catchAsync = require(`${__dirname}/../utils/catchAsync`);

const dotenv = require('dotenv');
dotenv.config({
  //việc đọc các biến môi trường từ file .env xảy ra duy nhất
  //1 lần, sau đó nó nằm trong process và có thể truy cập ở tất cả mọi nơi
  path: `${__dirname}/../.env`,
});

// Cấu hình kết nối MySQL
const connectionPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.MYSQL_PORT,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed for connection pooling
  queueLimit: 0,
});

/*
Nhóm kết nối - Connection Pool - được sử dụng để cải thiện hiệu suất thực thi 
các truy vấn trên cơ sở dữ liệu mà không có ngoại lệ, 
ngăn việc mở và đóng kết nối thường xuyên cũng như giảm số lượng kết nối mới.

Thay vì so với thông thường, với single connection, chúng ta cần phải mở kết nối đối với mỗi truy vấn,
khiến việc thực thi chúng làm chậm ứng dụng và giảm hiệu suất
*/

// Chuyển pool.query thành hàm trả về Promise
const poolQuery = (query, params) => {
  return connectionPool.promise().query(query, params);
};

const poolExecute = (execution, params) => {
  return connectionPool.promise().execute(execution, params);
};

module.exports = {
  connectionPool,
  poolQuery,
  poolExecute,
};
