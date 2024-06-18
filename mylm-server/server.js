const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Hoặc mssql nếu dùng SQL Server
const app = express();
const port = 8000;

const dotenv = require('dotenv');
dotenv.config({
  //việc đọc các biến môi trường từ file .env xảy ra duy nhất
  //1 lần, sau đó nó nằm trong process và có thể truy cập ở tất cả mọi nơi
  path: './.env',
});

//Xử lý các ngoại lệ không thể catch bằng các middleware xử lý hay các trình catch khác
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception BOOM Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const route = express.Router();

app.use(cors());
app.use(express.json());

// Cấu hình kết nối MySQL (tương tự với mssql)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT, // Non-standard port (if applicable)
  charset: 'utf8mb4',
  // connectionLimit: 10, // Adjust as needed for connection pooling
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  app.use((req, res, next) => {
    //next là đối số thứ 3 để truyền vào middleware
    console.log('Hello from the middleware');
    res.status(200).json({
      status: 'success',
      message: 'ok con be',
    });
    next();
  });
  console.log('Connected as id ' + connection.threadId);
  // console.log('Connected as id ' + JSON.stringify(connection));
});

// API endpoint
// app.get('/api/data', (req, res) => {
//   connection.query('SELECT * FROM mytable', (error, results) => {
//     if (error) throw error;
//     res.json(results);
//   });
// });

// app.use((req, res, next) => {
//   //next là đối số thứ 3 để truyền vào middleware
//   console.log('Hello from the middleware');
//   res.status(200).json({
//     status: 'success',
//     message: 'ok con be',
//   });
//   next();
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
