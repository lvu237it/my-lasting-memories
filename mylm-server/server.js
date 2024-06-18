/* ---------------------------- Note ------------------------------
  Nên giữ logic ứng dụng (application logic) trong Controller
  và giữ logic nghiệp vụ (business logic) trong Model
  */
const app = require('./app');
const connectionPool = require('./database/connection');
const UserModel = require('./controllers/userController');

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

// Kiểm tra kết nối cơ sở dữ liệu
if (connectionPool) {
  console.log('Connecting to database successful');
}

// Gọi hàm getAllUsers và in kết quả ra console

// app.get(
//   '/users',

//   //   async (req, res, next) => {
//   //   try {
//   //     const users = await UserModel.getAllUsers();
//   //     res.status(200).json({
//   //       status: 'success',
//   //       data: users,
//   //     }); // send a json response
//   //   } catch (e) {
//   //     console.log(e); // console log the error so we can see it in the console
//   //     res.sendStatus(500);
//   //   }
//   // }

//   async (req, res, next) => {
//     try {
//       const users = await UserModel.getAllUsers();
//       console.log('Users:', users); // In ra kết quả truy vấn
//       res.status(200).json({
//         status: 'success',
//         data: users,
//       }); // send a json response
//     } catch (err) {
//       console.error('Error when getting users:', err);
//       res.sendStatus(500);
//     }
//   }
// );

app.use('/users', () => {
  console.log('Users got it');
});

const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

let rs;
// async function main() {
//   result = await UserModel.SelectAllElements();
//   // do something with result
// }
// main()
//   .then((result) => console.log(result))
//   .catch((err) => console.error(err));

// UserModel.getAllUsers()
//   .then((result) => {
//     //do something with result
//     rs = result;
//     console.log(rs);
//   })
//   .catch(console.error);

//"Tấm lưới an toàn" cuối cùng để xử lý các lỗi không được handle
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandler Rejection BOOM Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
