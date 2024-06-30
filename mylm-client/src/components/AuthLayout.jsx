import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  console.log('AuthLayout rendered');
  return (
    <div className='auth-container'>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
