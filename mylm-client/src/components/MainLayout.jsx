import React, { useContext, useEffect, useRef, useState } from 'react';
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
  BiPencil,
  BiImageAdd,
  BiVideoPlus,
  BiUserVoice,
  BiFileBlank,
} from 'react-icons/bi';
import { AiFillBell, AiFillHome } from 'react-icons/ai';
import NavBar from './NavBar';

import { useCommon } from '../contexts/CommonContext';

const MainLayout = () => {
  const {
    showNavbarSlider,
    setShowNavbarSlider,
    navbarIconRef,
    navbarSliderRef,
    headerIconsClicked,
    setHeaderIconsClicked,
    showIcon,
    setShowIcon,
    handleClickHeaderIcons,
    handleClickNavbarIcon,
    handleOpenPostModal,
    handleClosePostModal,
    handleClickPostNew,
    handleClickOutside,
    postModal,
    setPostModal,
    postContent,
    setPostContent,
    hasPostContent,
    setHasPostContent,
    showdiscardModal,
    setShowDiscardModal,
    clickCancelDiscard,
    setClickCancelDiscard,
    discard,
    setDiscard,
    textareaRef,
    handleCreatePost,
    ToastContainer,
    addPostIconRef,
    redundantCharactersNumber,
    setRedundantCharactersNumber,
    numberCharactersAllowed,
  } = useCommon();

  const navigate = useNavigate();

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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (discard) {
      textareaRef.current.value = '';
      setDiscard(false);
      setPostModal(false);
      setShowDiscardModal(false);
      setHasPostContent(false);
      setPostContent('');
    }
  }, [discard]);

  useEffect(() => {
    if (clickCancelDiscard) {
      setClickCancelDiscard(false);
      setPostModal(true);
      setShowDiscardModal(false);
      setHasPostContent(true);
    }
  }, [clickCancelDiscard]);

  useEffect(() => {
    const htmlPage = document.getElementsByTagName('html')[0];
    const body = document.getElementsByTagName('body')[0];
    const stickyHeader = document.getElementById('sticky-header');
    if (postModal) {
      stickyHeader.classList.remove('z-10');
      htmlPage.classList.add('no-scroll');
      body.classList.add('no-scroll');
    } else {
      stickyHeader.classList.add('z-10');
      htmlPage.classList.remove('no-scroll');
      body.classList.remove('no-scroll');
    }
  }, [postModal]);

  useEffect(() => {
    const countRedundantCharacter =
      numberCharactersAllowed - postContent.length; //Số lượng kí tự dư thừa
    console.log(countRedundantCharacter);
    setRedundantCharactersNumber(countRedundantCharacter);
  }, [postContent]);

  return (
    <div className='container w-[95%] max-w-screen-xl mx-auto relative'>
      <div
        id='add-post-icon'
        ref={addPostIconRef}
        className='z-[1000] flex items-center gap-2 rounded-full bg-white hover:bg-slate-100 duration-300 ease-in-out border border-slate-300 shadow shadow-slate-200 fixed right-3 bottom-4 xl:bottom-9 xl:right-14 cursor-pointer'
      >
        <div onClick={handleOpenPostModal} className='text-2xl p-3'>
          <BiPencil />
        </div>
      </div>

      {/* Successful notification after creating post */}
      <ToastContainer />

      {/* Discard new content modal */}
      <div
        className='discard-modal z-20 fixed top-0 left-0 w-full h-full bg-black bg-opacity-90'
        style={{ display: showdiscardModal ? 'block' : 'none' }}
      >
        <div className='bg-white h-[120px] rounded-2xl fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          <div className='grid divide-y-2 w-[280px] h-full'>
            <div className='mx-auto my-auto font-bold tracking-wide'>
              Discard content?
            </div>
            <div className='flex relative'>
              <div className='absolute border border-slate-200 h-full font-medium text-xl left-1/2'></div>
              <button
                onClick={() => setClickCancelDiscard(true)}
                className='basis-1/2 relative before:absolute before:inset-0 before:-my-4 before:content-[""] mx-auto my-auto cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={() => setDiscard(true)}
                className='basis-1/2 relative before:absolute before:inset-0 before:-my-4 before:content-[""] mx-auto my-auto font-bold tracking-wide text-red-500 cursor-pointer'
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Post new content modal */}
      <div
        style={{
          display: postModal ? 'block' : 'none',
        }}
        className='modal-new-post z-10 fixed top-0 left-0 w-full h-full bg-black bg-opacity-75'
      >
        <div className='w-full h-full flex sm2:justify-center sm2:items-center'>
          <div className='post-content relative sm2:rounded-3xl bg-white sm2:w-[65%] md:w-[60%] lg:w-[50%]'>
            <div className='px-8 py-6 w-[100vw] sm2:w-full h-full'>
              <div className='number-of-redundant-characters absolute right-[2.25rem] top-[4.75rem] sm2:top-[3rem] sm2:right-[1.5rem] text-red-600'>
                {redundantCharactersNumber < 0 ? redundantCharactersNumber : ''}
              </div>
              <div className='absolute sm2:top-[1.2rem] sm2:right-[1.5rem]'>
                <div
                  onClick={(e) => {
                    handleClosePostModal(e);
                  }}
                  className='post-cancel font-semibold text-red-500 opacity-55 hover:opacity-75 text-base cursor-pointer left-[2.0rem] top-[1.8rem] '
                >
                  Cancel
                </div>
              </div>
              <div className='post-content-description mt-10 sm2:my-0'>
                <div className='sm:flex gap-2'>
                  <div className='sm:basis-1/10'>
                    <img
                      className='w-[50px] h-[50px] rounded-full bg-no-repeat bg-center bg-cover object-cover'
                      src='201587.jpg'
                      alt=''
                    />
                  </div>
                  <div className='sm:basis-[95%]'>
                    <div className=''>
                      <div className='font-semibold tracking-wide text-indigo-500'>
                        Lưu Vũ
                      </div>
                      <div className='relative'>
                        <textarea
                          ref={textareaRef}
                          onChange={(e) => handleClickPostNew(e)}
                          className='w-full tracking-wide py-1 sm:py-0 sm:w-[90%] h-[50vh] sm2:h-52 leading-loose break-words whitespace-pre-wrap outline-none resize-none'
                          name=''
                          id='post-content-details'
                          placeholder='Speak your mind...'
                        ></textarea>
                      </div>
                      <hr className='my-1 w-[95%] sm:w-[87%] sm2:w-[84%]' />
                    </div>
                  </div>
                </div>
              </div>

              <div className='list-icon-attachment sm:ml-14'>
                <ul className='flex gap-5 text-2xl mt-3 sm2:mt-2 cursor-pointer '>
                  <li>
                    <BiImageAdd />
                  </li>
                  <li>
                    <BiVideoPlus />
                  </li>
                  <li>
                    <BiUserVoice />
                  </li>
                  <li>
                    <BiFileBlank />
                  </li>
                </ul>
              </div>
              <input
                hidden
                accept='image/jpeg,image/png,video/mp4,video/quicktime'
                type='file'
                multiple
              />
              <div className='post-myself-button'>
                {hasPostContent ? (
                  <button
                    onClick={handleCreatePost}
                    className='post-button absolute top-[1.5rem] right-[1.5rem] sm2:top-[17rem] sm2:right-[1rem] font-semibold px-4 py-2 my-auto border-slate-400 rounded-xl shadow shadow-slate-300'
                  >
                    Post
                  </button>
                ) : (
                  <button
                    disabled={true}
                    className='post-button absolute top-[1.5rem] right-[1.5rem] sm2:top-[17rem] sm2:right-[1rem] font-semibold px-4 py-2 my-auto border-slate-400 opacity-50 rounded-xl shadow shadow-slate-300'
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='main-content flex flex-col lg:flex-row m-4'>
        <div
          id='sticky-header'
          className='max-w-screen-xl z-10 lg:max-w-[300px] sm2:sticky top-0 border-slate-50 bg-white'
        >
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
