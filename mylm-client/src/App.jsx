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

function App() {
  const [headerIconsClicked, setHeaderIconsClicked] = useState('');
  const [showIcon, setShowIcon] = useState([
    'header-icon-bi-home-before',
    'header-icon-bi-search-before',
    'header-icon-bi-bell-before',
    'header-icon-bi-playlist',
    'header-icon-bi-bookmark-before',
    'header-icon-bi-message',
  ]);

  const navigate = useNavigate();

  const handleClickHeaderIcons = (e) => {
    const iconId = e.currentTarget.id;
    setHeaderIconsClicked(iconId);
  };

  useEffect(() => {
    const iconClicked = document.getElementById(headerIconsClicked);
    const allHeaderIcons = Array.from(
      document.querySelectorAll('.left-sidebar-icons')
    );
    let showingIcons = [...showIcon];
    if (!iconClicked) {
      setHeaderIconsClicked('header-icon-bi-home');

      showingIcons.shift();
      setShowIcon(showingIcons);

      return;
    } else {
      let unclickedHeaderIcons = allHeaderIcons.filter(
        (icon) => icon.id !== iconClicked.id
      );

      unclickedHeaderIcons.forEach((e) => {
        e.classList.remove(
          'bg-gray-100',
          'shadow',
          'shadow-slate-200',
          'scale-110'
        );
        e.classList.add(
          'hover:bg-gray-100',
          'hover:shadow',
          'hover:shadow-slate-200',
          'scale-90'
        );
      });

      iconClicked.classList.remove(
        'hover:bg-gray-100',
        'hover:shadow',
        'hover:shadow-slate-200',
        'scale-90'
      );
      iconClicked.classList.add(
        'bg-gray-100',
        'shadow',
        'shadow-slate-200',
        'scale-110'
      );
    }
  }, [headerIconsClicked, showIcon]);

  useEffect(() => {
    if (headerIconsClicked === 'header-icon-bi-home') {
      navigate('/');
    } else if (headerIconsClicked === 'header-icon-bi-search') {
      navigate('/search');
    } else if (headerIconsClicked === 'header-icon-bi-bell') {
      navigate('/notifications');
    } else if (headerIconsClicked === 'header-icon-bi-playlist') {
      navigate('/myplaylists');
    } else if (headerIconsClicked === 'header-icon-bi-bookmark') {
      navigate('/savedposts');
    } else if (headerIconsClicked === 'header-icon-bi-message') {
      navigate('/messages');
    }
  }, [headerIconsClicked]);

  return (
    <>
      <Routes>
        <Route
          path='login'
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path='register'
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path='forgotpassword'
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path='resetpassword/:token'
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />
        <Route
          element={
            <MainLayout
              handleClickHeaderIcons={handleClickHeaderIcons}
              headerIconsClicked={headerIconsClicked}
              showIcon={showIcon}
            />
          }
        >
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<Search />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/myplaylists' element={<MyPlaylists />} />
          <Route path='/savedposts' element={<SavedPosts />} />
          <Route path='/messages' element={<Messages />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
