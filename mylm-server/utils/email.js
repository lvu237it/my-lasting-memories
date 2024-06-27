// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json({ limit: "25mb" }));
// app.use(express.urlencoded({ limit: "25mb" }));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });

// function sendEmail({ email, subject, message, productMessage, totalMessage }) {
//   return new Promise((resolve, reject) => {
//     var transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "vulvhe176037@fpt.edu.vn",
//         pass: "qkxa pghc tmnn zyui", //this password is created by google app password instead of using your default password
//       },
//     });

//     const mail_configs = {
//       from: "vulvhe176037@fpt.edu.vn",
//       to: email,
//       subject: subject,
//       html: `
//       <p>${message}</p>
//       <div>More details: </div>
//       <div>${productMessage}</div>
//       <div>${totalMessage}</div>
//       <p>Best Regards</p>
//       `,
//     };
//     transporter.sendMail(mail_configs, function (error, info) {
//       if (error) {
//         console.log(error);
//         return reject({ message: `An error has occurred` });
//       }
//       return resolve({ message: "Email sent successfully" });
//     });
//   });
// }

// app.get("/", (req, res) => {
//   sendEmail(req.query)
//     .then((response) => res.send(response.message))
//     .catch((error) => res.status(500).send(error.message));
// });

// app.listen(port, () => {
//   console.log(`nodemailerProject is listening at http://localhost:${port}`);
// });
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1. Create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2. Define the email options
  const mailOptions = {
    from: 'Luu Van Vu <vulv@gmail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:''
  };

  //3. Actually send the email
  await transporter.sendMail(mailOptions);

  // -------------- CÁCH DƯỚI ĐÂY LÀ 1 CÁCH RIÊNG ĐỂ CHO PHÉP GỬI MAIL TỪ 1 MAIL CÁ NHÂN CỤ THỂ -------------------
  //------------------------TUY NHIÊN CẦN CHẠY TRÊN 1 SERVER VỚI PORT RIÊNG BIỆT ----------------
  // let transporter = nodemailer.createTransport({
  //   service: "gmail",
  // port: process.env.EMAIL_PERSONAL_PORT,
  //   auth: {
  //     user: "EMAIL_PERSONAL_USERNAME_AUTH",
  //     pass: "EMAIL_PERSONAL_PASSWORD_AUTH", //this password is created by google app password instead of using your default password
  //   },
  // });

  // const mail_configs = {
  //   from: "vulvhe176037@fpt.edu.vn",
  //   to: email,
  //   subject: subject,
  //   html: `
  //   <p>${message}</p>
  //   <div>More details: </div>
  //   <div>${productMessage}</div>
  //   <div>${totalMessage}</div>
  //   <p>Best Regards</p>
  //   `,
  // };
};

module.exports = sendEmail;
