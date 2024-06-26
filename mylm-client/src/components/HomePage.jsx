import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const navigate = useNavigate();
  const checkRememberMeSession = async () => {
    try {
      await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/users/checkrememberme',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error logging in:', error);
      // Xử lý lỗi khi đăng nhập
      // setErrorMessage(error.response.data.message || 'Logging failed'); //lấy response từ server hiển thị lỗi cho user
    }
  };
  document.addEventListener(
    'DOMContentLoaded',
    //gửi request tới server để kiểm tra remember me
    checkRememberMeSession
  );

  return (
    <div>
      {/* With authorization
        Check Remember Me có tồn tại không - khi vào homepage luôn mà không login
        Tức là khi vào homepage mà có thông tin đăng nhập thì chuyển thành session của user đã đăng nhập
        Ngược lại có thể để homepage mặc định, hoặc navigate về trang login
      */}
      HOMEPAGE
    </div>
  );
}

export default HomePage;
