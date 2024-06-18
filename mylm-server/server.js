const app = require('./app');
const connectDB = require('./database/connection');

//Xử lý các ngoại lệ không thể catch bằng các middleware xử lý hay các trình catch khác
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception BOOM Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// API endpoint
// app.get('/api/data', (req, res) => {
//   connection.query('SELECT * FROM mytable', (error, results) => {
//     if (error) throw error;
//     res.json(results);
//   });
// });

//Connecting to database
const startServer = () => {
  try {
    connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

startServer();

//"Tấm lưới an toàn" cuối cùng để xử lý các lỗi không được handle
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandler Rejection BOOM Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
