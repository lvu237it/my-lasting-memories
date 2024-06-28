import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
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

const MainLayout = ({ handleClickHeaderIcons, headerIconsClicked }) => {
  const [showNavbarSlider, setShowNavbarSlider] = useState(false);
  const navbarIconRef = useRef(null);
  const navbarSliderRef = useRef(null);

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
        <div className='max-w-screen-xl lg:max-w-[300px] sticky top-0 border-slate-50 bg-white'>
          <div className='left-sidebar sticky top-0 flex flex-row lg:flex-col my-5 lg:my-3'>
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
