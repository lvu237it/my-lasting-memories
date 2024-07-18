import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { BiSmile } from 'react-icons/bi';
import {
  FaThumbsUp,
  FaThumbsDown,
  FaMeh,
  FaSadCry,
  Fa500Px,
  FaAmazonPay,
  FaSmileBeam,
} from 'react-icons/fa';
import { FaSmile } from 'react-icons/fa';
import { useCommon } from '../contexts/CommonContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { isUser, setIsUser, apiBaseUrl } = useCommon();

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
    console.log(rememberMe);
  }, [email, password, rememberMe]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: 'post',
        url: `${apiBaseUrl}/users/login`,
        data: {
          email,
          password,
          rememberMe,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Login successful');
      // Xử lý response sau khi đăng nhập thành công
      const admin = response.data.data.user;
      if (admin.role === 'admin') {
        setIsUser(false);
        localStorage.setItem('admin', JSON.stringify(admin));
        console.log('admin', admin);
      }
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      // Xử lý lỗi khi đăng nhập
      setErrorMessage(error.response.data.message || 'Logging failed'); //lấy response từ server hiển thị lỗi cho user
    }
  };

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin) {
      setIsUser(false);
      navigate('/');
    }
  }, []);
  return (
    <>
      <div className='background-image-common'>
        <div className='bg-slate-800 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative'>
          <h1 className='text-3xl font-bold mb-6 flex justify-center items-center gap-2'>
            <div className=''>Cảm ơn vì đã đến</div> <FaSmileBeam />
          </h1>
          <form action=''>
            {errorMessage && (
              <div className='max-w-[288px] text-center text-yellow-200 mb-4'>
                {errorMessage}
              </div>
            )}
            <div className='relative my-4'>
              <input
                autoFocus
                autoComplete='true'
                className='block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='text'
              />
              <label id='email-label' className='absolute flex text-base'>
                Email
              </label>
              <BiUser className='absolute top-[14px] right-4' />
            </div>
            <div className='relative my-4'>
              <input
                autoComplete='true'
                className='block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
              />
              <label id='password-label' className='absolute flex text-base'>
                Mật khẩu
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
              {/* <div className='flex gap-2 items-center'>
                <input
                  type='checkbox'
                  name=''
                  id='remember-checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor='Remember Me'>Remember Me</label>
              </div> */}
              <div className='mx-auto'>
                <Link to='/forgotpassword' className='text-blue-500'>
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
            <button
              onClick={(e) => {
                handleLogin(e);
              }}
              className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300'
              type='submit'
            >
              Đăng nhập
            </button>
            <div className='flex justify-center items-center gap-3'>
              <span className=''>Chưa có tài khoản? </span>
              <Link className='text-blue-500' to='/register'>
                Tạo tài khoản
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
