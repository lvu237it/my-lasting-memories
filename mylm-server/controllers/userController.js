const { poolQuery } = require('../database/connection');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const [rows, fields] = await poolQuery('SELECT * FROM users');
    if (!rows) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: rows.length,
      data: {
        data: rows,
      },
    });
    // return rows; // Trả về kết quả truy vấn
    // return { rows, fields }; // Trả về kết quả truy vấn
  } catch (err) {
    console.error('Error when getting users:', err);
    throw err; // Ném lỗi ra ngoài để hàm gọi có thể xử lý
  }
};
