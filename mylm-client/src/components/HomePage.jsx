import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  BiDotsHorizontalRounded,
  BiDotsVertical,
  BiDotsVerticalRounded,
  BiFileBlank,
  BiImageAdd,
  BiPencil,
  BiPlusCircle,
  BiUserVoice,
  BiVideoPlus,
} from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { useCommon } from '../contexts/CommonContext';
import { BiArrowBack } from 'react-icons/bi';

function HomePage() {
  const {
    handleOpenPostModal,
    postModal,
    postsList,
    usersList,
    getAllUsers,
    getAllPosts,
    getAuthorNameOfPostByUserId,
  } = useCommon();
  const [viewPostDetails, setViewPostDetails] = useState(false);
  const postDetailsRef = useRef(null);
  const [chosenPost, setChosenPost] = useState(null);

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

  const handleViewPostDetails = (post) => {
    setChosenPost(post);
    setViewPostDetails(true);
  };

  const handleBackHome = () => {
    console.log('back home clicked');
    setViewPostDetails(false);
  };

  useEffect(() => {
    if (!viewPostDetails) {
      setChosenPost(null);
    }
  }, [viewPostDetails]);

  const getPostedTime = (createdAt) => {
    return createdAt.split('T')[0];
  };

  useEffect(() => {
    getAllUsers();
    getAllPosts();
  }, []);
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
          {viewPostDetails ? (
            <div className='wrapper-post-details'>
              <button
                onClick={handleBackHome}
                className='text-2xl mb-1 rounded-full p-3 hover:bg-slate-100 cursor-pointer hover:-translate-x-1 duration-300 ease-in-out'
              >
                <BiArrowBack />
              </button>
              <div className='post-details max-w-screen-md mx-auto text-sm sm2:text-base'>
                <div className='details-chosen-post grid grid-cols-12 relative'>
                  <div className='col-span-1'>
                    <img
                      src='201587.jpg'
                      alt=''
                      className='my-avatar absolute top-0 left-0 w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                    />
                  </div>
                  <div className='col-span-11 flex flex-col'>
                    <div className='flex justify-between'>
                      <div className='name-and-postedat absolute top-0 left-12 sm2:left-16'>
                        <div className=''>
                          name:{' '}
                          {getAuthorNameOfPostByUserId(chosenPost.user_id)}
                        </div>
                        <div className='flex flex-row gap-1 items-center'>
                          <BiPencil />
                          <div className=''>
                            {getPostedTime(chosenPost.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className='absolute top-0 right-0 text-xl sm2:text-2xl cursor-pointer rounded-full p-1 hover:bg-slate-100'>
                        <BiDotsHorizontalRounded />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='content feeds-content-bottom-description break-words mt-16'>
                  {chosenPost.content}
                  iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsads123456789
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className='feeds-content-posts-of-myself flex flex-row justify-between gap-3'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='my-avatar basis-1/7 w-10 h-10 sm2:w-[50px] sm2:h-[50px] my-auto rounded-full bg-cover bg-no-repeat bg-center'
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

              {/* List of posts */}
              {postsList &&
                postsList.map((post, index) => (
                  <div
                    onClick={() => handleViewPostDetails(post)}
                    key={post.post_id}
                    className='cursor-pointer text-sm sm2:text-base'
                  >
                    <div className='feeds-content-posts grid relative mb-[85px]'>
                      <div className='feeds-content-top-about absolute top-0 left-0'>
                        <img
                          src='201587.jpg'
                          alt=''
                          className='rounded-full w-10 h-10 sm2:w-12 sm2:h-12'
                        />
                      </div>
                      <div className='result-content absolute top-0 left-12 sm2:left-16 w-[80%] sm2:w-[88%]'>
                        <div className='information-and-posttime'>
                          <div className='author-name font-semibold'>
                            {getAuthorNameOfPostByUserId(post.user_id)}
                          </div>
                          <div className='text-slate-700 opacity-70'>
                            Posted at {getPostedTime(post.created_at)}
                          </div>
                          <div className='feeds-content-bottom-description whitespace-nowrap overflow-hidden overflow-ellipsis'>
                            {post.content}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index !== postsList.length - 1 && (
                      <hr className='mb-5 border-slate-300' />
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
