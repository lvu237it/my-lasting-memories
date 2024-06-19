/* ---------------------------- Note ------------------------------
  Nên giữ logic ứng dụng (application logic) trong Controller
  và giữ logic nghiệp vụ (business logic) trong Model
  */
const app = require('./app');
const connectionPool = require('./database/connection');

//Xử lý các ngoại lệ không thể catch bằng các middleware xử lý hay các trình catch khác
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception BOOM Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Kiểm tra kết nối cơ sở dữ liệu
if (connectionPool) {
  console.log('Connecting to database successful');
}

const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//"Tấm lưới an toàn" cuối cùng để xử lý các lỗi không được handle
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandler Rejection BOOM Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
