import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { useCommon } from '../contexts/CommonContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { apiBaseUrl } = useCommon();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username) {
      setErrorMessage('Vui lòng cung cấp Họ và Tên');
      return;
    } else if (!email) {
      setErrorMessage('Vui lòng cung cấp email');
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage('Xác nhận mật khẩu KHÔNG khớp');
      return;
    } else if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 kí tự');
      return;
    }

    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/users/signup',
        data: {
          username,
          email,
          password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Register successful:', response.data);
      // Xử lý response sau khi đăng ký thành công
      navigate('/');
    } catch (error) {
      console.error('Error registering:', error);
      // Xử lý lỗi khi đăng ký
      setErrorMessage(error.response.data.message || 'Registration failed'); //lấy response từ server hiển thị lỗi cho user
    }
  };

  return (
    <>
      <div className='background-image-common'>
        <div className='bg-slate-800 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative'>
          <h1 className='text-4xl font-bold text-center mb-6'>Tạo tài khoản</h1>
          <form action=''>
            {errorMessage && (
              <div className='max-w-[288px] text-center text-yellow-200 mb-4'>
                {errorMessage}
              </div>
            )}
            <div className='relative my-4'>
              <input
                autoFocus
                className='block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type='text'
              />
              <label className='absolute flex text-base duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6'>
                Họ và Tên
              </label>
              <BiUser className='absolute top-[14px] right-4' />
            </div>
            <div className='relative my-4'>
              <input
                className='block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='text'
              />
              <label className='absolute flex text-base duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6'>
                Email
              </label>
              <BiUser className='absolute top-[14px] right-4' />
            </div>
            <div className='relative my-4'>
              <input
                className='block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
              />
              <label className='absolute flex text-base  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0  peer-focus:-translate-y-6'>
                Mật khẩu
              </label>
              <div
                className='absolute top-[14px] right-10 cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
              <AiOutlineLock className='absolute top-[14px] right-4' />
            </div>
            <div className='relative my-4'>
              <input
                className='block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? 'text' : 'password'}
              />
              <label className='absolute flex text-base duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0  peer-focus:-translate-y-6'>
                Xác nhận lại mật khẩu
              </label>
              <div
                className='absolute top-[14px] right-10 cursor-pointer'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </div>
              <AiOutlineLock className='absolute top-[14px] right-4' />
            </div>

            <button
              onClick={(e) => handleRegister(e)}
              className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300'
              type='submit'
            >
              Gửi
            </button>
            <div className='flex justify-center items-center gap-3'>
              <span className=''>Bạn vừa tạo tài khoản? </span>
              <Link className='text-blue-500' to='/login'>
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
