const mysql = require('mysql2');
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const { promisify } = require('util');

const dotenv = require('dotenv');
dotenv.config({
  //việc đọc các biến môi trường từ file .env xảy ra duy nhất
  //1 lần, sau đó nó nằm trong process và có thể truy cập ở tất cả mọi nơi
  path: `${__dirname}/../.env`,
});

// Cấu hình kết nối MySQL
const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.MYSQL_PORT,
    charset: 'utf8mb4',
    // connectionLimit: 10, // Adjust as needed for connection pooling
  });
  console.log('DB connection successful');
  console.log('Connected as id ' + connection.threadId);
  return connection;
};

module.exports = connectDB;
