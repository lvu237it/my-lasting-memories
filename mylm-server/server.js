const express = require("express");
const cors = require("cors");
const mysql = require("mysql2"); // Hoặc mssql nếu dùng SQL Server
const app = express();
const port = 8000;

const route = express.Router();

app.use(cors());
app.use(express.json());

// Cấu hình kết nối MySQL (tương tự với mssql)
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "mydatabase",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting: " + err.stack);
//     return;
//   }
//   console.log("Connected as id " + connection.threadId);
// });

// API endpoint
// app.get("/api/data", (req, res) => {
//   connection.query("SELECT * FROM mytable", (error, results) => {
//     if (error) throw error;
//     res.json(results);
//   });
// });

app.use((req, res, next) => {
  //next là đối số thứ 3 để truyền vào middleware
  console.log("Hello from the middleware");
  res.status(200).json({
    status: "success",
    message: "ok con be",
  });
  next();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
