import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import backgroundImage from './assets/nature_landscape_forest_trees_shrine_anime-163103.jpg';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import HomePage from './components/HomePage';

function App() {
  return (
    <>
      <div
        className='text-white h-[100vh] flex justify-center items-center bg-no-repeat bg-center bg-cover'
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='login' element={<Login />}></Route>
          <Route path='register' element={<Register />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
