import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

  const handleLogin = async () => {
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
    } catch (error) {
      console.error('Error logging in:', error);
      // Xử lý lỗi khi đăng nhập
    }
  };

  return (
    <>
      <div className='bg-slate-800 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative'>
        <h1 className='text-4xl font-bold text-center mb-6'>Login</h1>
        <form action=''>
          <div className='relative my-4'>
            <input
              autoFocus
              className='block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='text'
            />
            <label className='absolute flex text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-6'>
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
            <label className='absolute flex text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-6'>
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
