import { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, useFetcher } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Search from './components/Search';
import MyPlaylists from './components/MyPlaylists';
import Notifications from './components/Notifications';
import SavedPosts from './components/SavedPosts';
import Messages from './components/Messages';
import LoadingSpinner from './components/LoadingSpinner';

import { useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';
import Profile from './components/Profile';
import ViewPostDetails from './components/ViewPostDetails';

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/resetpassword/:token' element={<ResetPassword />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<Search />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/myplaylists' element={<MyPlaylists />} />
          <Route path='/savedposts' element={<SavedPosts />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/post-details' element={<ViewPostDetails />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
