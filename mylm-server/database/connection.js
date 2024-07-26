// const mysql = require('mysql2');
// const catchAsync = require(`${__dirname}/../utils/catchAsync`);

// const dotenv = require('dotenv');
// dotenv.config({
//   //việc đọc các biến môi trường từ file .env xảy ra duy nhất
//   //1 lần, sau đó nó nằm trong process và có thể truy cập ở tất cả mọi nơi
//   path: `${__dirname}/../.env`,
// });

// // Cấu hình kết nối MySQL
// const connectionPool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.MYSQL_PORT,
//   charset: 'utf8mb4',
//   waitForConnections: true,
//   connectionLimit: 10, // Adjust as needed for connection pooling
//   queueLimit: 0,
// });

// /*
// Nhóm kết nối - Connection Pool - được sử dụng để cải thiện hiệu suất thực thi
// các truy vấn trên cơ sở dữ liệu mà không có ngoại lệ,
// ngăn việc mở và đóng kết nối thường xuyên cũng như giảm số lượng kết nối mới.

// Thay vì so với thông thường, với single connection, chúng ta cần phải mở kết nối đối với mỗi truy vấn,
// khiến việc thực thi chúng làm chậm ứng dụng và giảm hiệu suất
// */

// // Chuyển pool.query thành hàm trả về Promise
// const poolQuery = (query, params) => {
//   return connectionPool.promise().query(query, params);
// };

// const poolExecute = (execution, params) => {
//   return connectionPool.promise().execute(execution, params);
// };

// module.exports = {
//   connectionPool,
//   poolQuery,
//   poolExecute,
// };

/* Sử dụng Sequelize để tạo kết nối tới database từ CockroachDB, sau khi data đã được import từ MySQL và chuyển lên CockroachDB*/
// const sequelize = require('./sequelize'); // Thay đổi đường dẫn đến file config sequelize của bạn

// const poolQuery = async (query, params) => {
//   try {
//     const [results, metadata] = await sequelize.query(query, {
//       replacements: params,
//     });
//     return results;
//   } catch (error) {
//     console.error('Error executing query:', error);
//     throw error;
//   }
// };

// const poolExecute = async (execution, params) => {
//   try {
//     const [results, metadata] = await sequelize.query(execution, {
//       replacements: params,
//     });
//     return results;
//   } catch (error) {
//     console.error('Error executing query:', error);
//     throw error;
//   }
// };

// module.exports = {
//   poolQuery,
//   poolExecute,
// };

// Sử dụng thư viện 'pg'
const { Pool } = require('pg'); // Import pg library
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

// Create a new pool instance using the DATABASE_URL from .env
const DBMyLM = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const poolConnection = new Pool({
  connectionString: DBMyLM,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  // max: 20, // Tối đa số lượng kết nối trong pool
  // idleTimeoutMillis: 30000, // Thời gian tối đa giữ kết nối nhàn rỗi trước khi đóng
});

// Function to execute a query (for SELECT)
const poolQuery = async (text, params) => {
  try {
    const res = await poolConnection.query(text, params);
    return res.rows; // Return rows for SELECT queries
  } catch (error) {
    console.error('Query error:', error);
    throw new AppError('Database query failed', 500);
  }
};

// Function to execute an update or insert (for INSERT, UPDATE, DELETE)
const poolExecute = async (text, params) => {
  try {
    const res = await poolConnection.query(text, params);
    return res.rowCount; // Return the number of affected rows
  } catch (error) {
    console.error('Execution error:', error);
    throw new AppError('Database execution failed', 500);
  }
};

// Export the query function and pool instance
module.exports = {
  poolQuery,
  poolExecute,
};
