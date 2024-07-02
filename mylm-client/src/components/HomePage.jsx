import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  BiFileBlank,
  BiImageAdd,
  BiPlusCircle,
  BiUserVoice,
  BiVideoPlus,
} from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { useCommon } from '../contexts/CommonContext';

function HomePage() {
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
    hasPostContent,
    setHasPostContent,
    showdiscardModal,
    setShowDiscardModal,
    clickCancelDiscard,
    setClickCancelDiscard,
    discard,
    setDiscard,
    textareaRef,
  } = useCommon();

  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkRememberMeSession = async () => {
  //     try {
  //       await axios({
  //         method: 'post',
  //         url: 'http://127.0.0.1:3000/users/checkrememberme',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error logging in:', error);
  //       // Xử lý lỗi khi đăng nhập
  //       // setErrorMessage(error.response.data.message || 'Logging failed'); //lấy response từ server hiển thị lỗi cho user
  //     }
  //   };
  //   checkRememberMeSession();
  // });

  {
    /* With authorization
        Check Remember Me có tồn tại không - khi vào homepage luôn mà không login
        Tức là khi vào homepage mà có thông tin đăng nhập thì chuyển thành session của user đã đăng nhập
        Ngược lại có thể để homepage mặc định, hoặc navigate về trang login
      */
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !postModal) {
        entry.target.classList.add('animate-fadeIn');
      } else {
        entry.target.classList.remove('animate-fadeIn');
        entry.target.classList.add('z-0');
      }
    });
  });

  useEffect(() => {
    const sectionPostedItems = document.querySelectorAll(
      '.feeds-content-posts'
    );
    sectionPostedItems.forEach((section) => observer.observe(section));

    return () => {
      sectionPostedItems.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      <div className='header-feedscontent my-3'>
        <div className='feeds-content border-slate-300 rounded-3xl shadow shadow-gray-400 px-10 md:px-20 mx-3 md:mx-10 lg:mx-14 py-5 md:py-10 my-5 '>
          <div className='feeds-content-posts-of-myself flex flex-row justify-between gap-3'>
            <img
              src='201587.jpg'
              alt=''
              className='my-avatar basis-1/7 max-w-[50px] h-[50px] my-auto rounded-full bg-cover bg-no-repeat bg-center'
            />
            <input
              className='post-input basis-[80%] hidden sm2:block tracking-wide'
              type='text'
              placeholder='Speak your mind...'
              readOnly
              onClick={handleOpenPostModal}
            />
            <div
              onClick={handleOpenPostModal}
              className='basis-1/7 text-4xl my-auto block sm2:hidden cursor-pointer'
            >
              <BiPlusCircle />
            </div>
            <button
              onClick={handleOpenPostModal}
              className='post-button hidden sm2:block basis-1/7 font-semibold px-4 py-2 my-auto border-slate-300 rounded-xl shadow shadow-slate-300'
            >
              Post
            </button>
          </div>
          <hr className='my-3 border-slate-300' />

          <div className='feeds-content-posts'>
            <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
              <img
                src='201587.jpg'
                alt=''
                className='max-w-[50px] h-[50px] rounded-full'
              />
              <div className=''>
                <div className='information-and-posttime'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                </div>
              </div>
            </div>

            <div className='feeds-content-bottom-description flex flex-col'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              perspiciatis rem molestiae et officia cupiditate. Velit ullam eum
              optio unde quo, dicta necessitatibus itaque enim nisi veniam
              aperiam, incidunt a.
            </div>
          </div>
          <hr className='my-3 border-slate-300' />

          <div className='feeds-content-posts'>
            <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
              <img
                src='201587.jpg'
                alt=''
                className='max-w-[50px] h-[50px] rounded-full'
              />
              <div className=''>
                <div className='information-and-posttime'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                </div>
              </div>
            </div>

            <div className='feeds-content-bottom-description flex flex-col'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              perspiciatis rem molestiae et officia cupiditate. Velit ullam eum
              optio unde quo, dicta necessitatibus itaque enim nisi veniam
              aperiam, incidunt a.
            </div>
          </div>
          <hr className='my-3 border-slate-300' />

          <div className='feeds-content-posts'>
            <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
              <img
                src='201587.jpg'
                alt=''
                className='max-w-[50px] h-[50px] rounded-full'
              />
              <div className=''>
                <div className='information-and-posttime'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                </div>
              </div>
            </div>

            <div className='feeds-content-bottom-description flex flex-col'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              perspiciatis rem molestiae et officia cupiditate. Velit ullam eum
              optio unde quo, dicta necessitatibus itaque enim nisi veniam
              aperiam, incidunt a.
            </div>
          </div>
          <hr className='my-3 border-slate-300' />

          <div className='feeds-content-posts'>
            <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
              <img
                src='201587.jpg'
                alt=''
                className='max-w-[50px] h-[50px] rounded-full'
              />
              <div className=''>
                <div className='information-and-posttime'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                </div>
              </div>
            </div>

            <div className='feeds-content-bottom-description flex flex-col'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              perspiciatis rem molestiae et officia cupiditate. Velit ullam eum
              optio unde quo, dicta necessitatibus itaque enim nisi veniam
              aperiam, incidunt a.
            </div>
          </div>
          <hr className='my-3 border-slate-300' />

          <div className='feeds-content-posts'>
            <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
              <img
                src='201587.jpg'
                alt=''
                className='max-w-[50px] h-[50px] rounded-full'
              />
              <div className=''>
                <div className='information-and-posttime'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                </div>
              </div>
            </div>

            <div className='feeds-content-bottom-description flex flex-col'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              perspiciatis rem molestiae et officia cupiditate. Velit ullam eum
              optio unde quo, dicta necessitatibus itaque enim nisi veniam
              aperiam, incidunt a.
            </div>
          </div>
          <hr className='my-3 border-slate-300' />

          <div className='feeds-content-posts'>
            <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
              <img
                src='201587.jpg'
                alt=''
                className='max-w-[50px] h-[50px] rounded-full'
              />
              <div className=''>
                <div className='information-and-posttime'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                </div>
              </div>
            </div>

            <div className='feeds-content-bottom-description flex flex-col'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              perspiciatis rem molestiae et officia cupiditate. Velit ullam eum
              optio unde quo, dicta necessitatibus itaque enim nisi veniam
              aperiam, incidunt a.
            </div>
          </div>
          <hr className='my-3 border-slate-300' />

          <div className='feeds-content-posts'>
            <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
              <img
                src='201587.jpg'
                alt=''
                className='max-w-[50px] h-[50px] rounded-full'
              />
              <div className=''>
                <div className='information-and-posttime'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                </div>
              </div>
            </div>

            <div className='feeds-content-bottom-description flex flex-col'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore
              perspiciatis rem molestiae et officia cupiditate. Velit ullam eum
              optio unde quo, dicta necessitatibus itaque enim nisi veniam
              aperiam, incidunt a.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
