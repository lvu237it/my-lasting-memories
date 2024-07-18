import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { useCommon } from '../contexts/CommonContext';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMessageErrorToken, setShowMessageErrorToken] = useState(false);
  const [showMessageSuccessful, setShowMessageSuccessful] = useState(false);
  const { apiBaseUrl } = useCommon();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      //Kiểm tra token trên params có hợp lệ hay không, nếu đường dẫn chứa token không hợp lệ thì không tiếp tục reset
      try {
        const response = await axios.get(
          `${apiBaseUrl}/users/verifyResetToken/${token}`
        );
      } catch (error) {
        console.error('Invalid token:', error);
        console.log('Token verified - fake');
        const formResetToken = document.getElementById('form-reset-token');
        formResetToken.classList.add('hidden');
        setShowMessageErrorToken(true);
      }
    };
    verifyToken();
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !passwordConfirm) {
      setErrorMessage('Vui lòng cung cấp đầy đủ mật khẩu');
    } else if (password !== passwordConfirm) {
      setErrorMessage('Xác nhận mật khẩu KHÔNG khớp');
    } else if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 kí tự');
    } else {
      try {
        const response = await axios({
          method: 'patch',
          url: `${apiBaseUrl}/users/resetPassword/${token}`,
          data: {
            password,
            passwordConfirm,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.data.user) {
          const formResetToken = document.getElementById('form-reset-token');
          formResetToken.classList.add('hidden');
          setShowMessageSuccessful(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
        console.log('Reset password successful:', response.data);
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    }
  };

  return (
    <>
      <div className='background-image-common'>
        <div className='bg-slate-800 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative'>
          <h1 className='text-4xl font-bold text-center mb-6'>
            Cài đặt mật khẩu
          </h1>
          {showMessageSuccessful && (
            <div className='max-w-[288px] '>
              <div className='text-center text-base text-green-300'>
                {/* Your password has been reset */}
                Mật khẩu của bạn đã được cài đặt lại.
              </div>
              <div className='text-center text-base text-green-300'>
                Tự động trở về trang đăng nhập...
              </div>
            </div>
          )}
          {/* Error message for invalid token */}
          {showMessageErrorToken && (
            <div className='max-w-[288px] '>
              <div className='text-center text-[18px] text-red-400'>
                {/* Token is invalid or expired */}
                Mã Token không hợp lệ
              </div>
              <Link to={'/forgotpassword'}>
                <button className='w-full mb-4 text-base mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300'>
                  {/* Back to Forgot Password */}
                  Quay về trang Quên mật khẩu
                </button>
              </Link>
            </div>
          )}
          <form action='' id='form-reset-token'>
            {/* Error message for input */}
            {errorMessage && (
              <div className='max-w-[288px] text-center text-yellow-200 mb-4'>
                {errorMessage}
              </div>
            )}
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
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
              onClick={(e) => handleResetPassword(e)}
              className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300'
              type='submit'
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
