import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import backgroundImage from './assets/201587.jpg'; // Import hình ảnh
import backgroundImage1 from './assets/R.jpg'; // Import hình ảnh
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';

function App() {
  return (
    <>
      <div
        className='text-white h-[100vh] flex justify-center items-center bg-no-repeat bg-center bg-cover'
        style={{
          backgroundImage: `url(${backgroundImage1})`,
        }}
      >
        <Routes>
          <Route path='login' element={<Login />}></Route>
          <Route path='register' element={<Register />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
