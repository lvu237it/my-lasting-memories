import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import backgroundImage from './assets/nature_landscape_forest_trees_shrine_anime-163103.jpg';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import HomePage from './components/HomePage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='login' element={<Login />}></Route>
        <Route path='register' element={<Register />}></Route>
        <Route path='forgotpassword' element={<ForgotPassword />}></Route>
        <Route path='resetpassword/:token' element={<ResetPassword />}></Route>
      </Routes>
    </>
  );
}

export default App;
