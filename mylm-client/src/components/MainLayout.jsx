import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  BiHome,
  BiSolidSearch,
  BiSearch,
  BiBell,
  BiSolidBellRing,
  BiSolidPlaylist,
  BiBookmark,
  BiSolidBookmark,
  BiMessage,
  BiMenu,
} from 'react-icons/bi';
import { AiFillBell, AiFillHome } from 'react-icons/ai';
import NavBar from './NavBar';

const MainLayout = () => {
  const [showNavbarSlider, setShowNavbarSlider] = useState(false);
  const navbarIconRef = useRef(null);
  const navbarSliderRef = useRef(null);

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
  }, [headerIconsClicked, navigate]);

  const handleClickOutside = (event) => {
    if (
      navbarIconRef.current &&
      navbarSliderRef.current &&
      !navbarIconRef.current.contains(event.target) &&
      !navbarSliderRef.current.contains(event.target)
    ) {
      setShowNavbarSlider(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickNavbarIcon = () => {
    setShowNavbarSlider(!showNavbarSlider);
  };

  return (
    <div className='container w-[95%] max-w-screen-xl mx-auto'>
      <div className='main-content flex flex-col lg:flex-row m-4'>
        <div className='relative z-10 max-w-screen-xl lg:max-w-[300px] sm2:sticky top-0 border-slate-50 bg-white'>
          <div className='left-sidebar sticky top-0 flex flex-row lg:flex-col my-5 lg:my-3 border-slate-50 bg-white'>
            <h5 className='MyLM font-semibold text-4xl mx-auto'>MyLM</h5>
            <div className='left-sidebar-icons-wrapper mx-auto'>
              <div className='flex sm2:hidden justify-center items-center text-3xl cursor-pointer relative'>
                <div ref={navbarIconRef} onClick={handleClickNavbarIcon}>
                  <BiMenu id='navbar-icon-bi-menu' />
                </div>
                {showNavbarSlider && (
                  <div
                    ref={navbarSliderRef}
                    id='navbar-slide'
                    className='absolute sm2:block right-[-3.5rem] top-0 text-right px-2 py-3 bg-slate-100 border-slate-400 rounded-xl'
                  >
                    <NavBar />
                  </div>
                )}
              </div>
              <div
                id='header-icon-bi-home'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiHome
                  id='header-icon-bi-home-before'
                  className='header-icons-common'
                />
              </div>
              <div
                id='header-icon-bi-search'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiSearch id='header-icon-bi-search-before' />
              </div>
              <div
                id='header-icon-bi-bell'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiBell id='header-icon-bi-bell-before' />
              </div>
              <div
                id='header-icon-bi-playlist'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiSolidPlaylist />
              </div>
              <div
                id='header-icon-bi-bookmark'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiBookmark id='header-icon-bi-bookmark-before' />
              </div>
              <div
                id='header-icon-bi-message'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiMessage />
              </div>
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
