import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessfulMessage, setShowSuccessfulMessage] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please provide an email');
      return;
    }

    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/users/forgotPassword',
        data: {
          email,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Forgot password successful:', response.data);
      if (!errorMessage) {
        const formResetToken = document.getElementById('form-reset-token');
        formResetToken.classList.add('hidden');
        setShowSuccessfulMessage(!showSuccessfulMessage);
        // navigate('/resetpassword');
      }
    } catch (error) {
      console.error('Error forgotting password:', error);
      // Xử lý lỗi khi đăng ký
      setErrorMessage(error.response.data.message || 'Forgotting failed'); //lấy response từ server hiển thị lỗi cho user
    }
  };
  return (
    <>
      <div className='background-image-common'>
        <div className='bg-slate-800 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative'>
          <h1 className='text-4xl font-bold text-center mb-6'>
            Forgot Password
          </h1>
          {showSuccessfulMessage && (
            <div className='max-w-[288px] '>
              <div className='text-center text-green-300'>
                A reset URL has been sent. Please check your inbox
              </div>
            </div>
          )}
          <form action='' id='form-reset-token'>
            <div className='max-w-[288px] text-center mb-6'>
              Please enter email to reset password
            </div>
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
              <label className='absolute flex text-base duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0  peer-focus:-translate-y-6'>
                Your Email
              </label>
              <BiUser className='absolute top-[14px] right-4' />
            </div>
            <button
              onClick={(e) => {
                handleForgotPassword(e);
              }}
              className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300'
              type='submit'
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
