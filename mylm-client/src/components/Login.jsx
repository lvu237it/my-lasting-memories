import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Effect to transform labels when inputs are filled
  useEffect(() => {
    const emailLabel = document.getElementById('email-label');
    const passwordLabel = document.getElementById('password-label');

    if (email) {
      emailLabel.classList.add('label-input-before');
    } else {
      emailLabel.classList.add('label-input-after');
    }
    if (password) {
      passwordLabel.classList.add('label-input-before');
    } else {
      passwordLabel.classList.add('label-input-after');
    }
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/users/login',
        data: {
          email,
          password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Login successful:', response.data);
      // Xử lý response sau khi đăng nhập thành công
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      // Xử lý lỗi khi đăng nhập
      setErrorMessage(error.response.data.message || 'Logging failed'); //lấy response từ server hiển thị lỗi cho user
    }
  };

  return (
    <>
      <div className='bg-slate-800 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative'>
        <h1 className='text-4xl font-bold text-center mb-6'>Login</h1>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='text'
            />
            <label id='email-label' className='absolute flex text-base'>
              Your Email
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
            <label id='password-label' className='absolute flex text-base'>
              Your Password
            </label>
            <AiOutlineLock className='absolute top-[14px] right-4' />
            <div
              className='absolute top-[14px] right-10 cursor-pointer'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <input type='checkbox' name='' id='' />
              <label htmlFor='Remember Me'>Remember Me</label>
            </div>
            <Link to='' className='text-blue-500'>
              Forgot Password?
            </Link>
          </div>
          <button
            onClick={(e) => {
              handleLogin(e);
            }}
            className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300'
            type='submit'
          >
            Login
          </button>
          <div className='flex justify-center items-center gap-3'>
            <span className=''>New Here? </span>
            <Link className='text-blue-500' to='/register'>
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
