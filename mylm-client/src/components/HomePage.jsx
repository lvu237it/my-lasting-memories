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

function HomePage() {
  const [postModal, setPostModal] = useState(false);
  const [hasPostContent, setHasPostContent] = useState(false);
  const [showdiscardModal, setShowDiscardModal] = useState(false);
  const [clickCancelDiscard, setClickCancelDiscard] = useState(false);
  const [discard, setDiscard] = useState(false);
  const textareaRef = useRef(null);
  // const navigate = useNavigate();
  // const location = useLocation();

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

  const handleOpenPostModal = () => {
    setPostModal(true);
  };

  useEffect(() => {
    if (discard) {
      textareaRef.current.value = '';
      setDiscard(false);
      setPostModal(false);
      setShowDiscardModal(false);
      setHasPostContent(false);
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

  const handleClosePostModal = (e) => {
    e.preventDefault();
    if (hasPostContent) {
      setShowDiscardModal(true);
    } else {
      setPostModal(false);
    }
  };

  const handleClickPostNew = (e) => {
    console.log('ok');
    if (e.target.value.trim()) {
      setHasPostContent(true);
      console.log('change');
    } else {
      setHasPostContent(false);
      console.log('not change');
    }
  };

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

  useEffect(() => {
    const htmlPage = document.getElementsByTagName('html')[0];
    const body = document.getElementsByTagName('body')[0];

    if (postModal) {
      htmlPage.classList.add('no-scroll');
      body.classList.add('no-scroll');
    } else {
      htmlPage.classList.remove('no-scroll');
      body.classList.remove('no-scroll');
    }
  }, [postModal]);

  return (
    <>
      {/* With authorization
        Check Remember Me có tồn tại không - khi vào homepage luôn mà không login
        Tức là khi vào homepage mà có thông tin đăng nhập thì chuyển thành session của user đã đăng nhập
        Ngược lại có thể để homepage mặc định, hoặc navigate về trang login
      */}
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
                    className='basis-1/2 relative before:absolute before:inset-0  before:-my-4 before:content-[""] mx-auto my-auto cursor-pointer'
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
              <div className='post-content sm2:rounded-3xl bg-white sm2:w-[65%] md:w-[60%] lg:w-[50%] relative'>
                <div className='px-8 py-6 w-[100vw] sm2:w-full h-full'>
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
                    <div className=' sm:flex gap-2'>
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
                            Luu Vu
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
                      <button className='post-button absolute top-[1.5rem] right-[1.5rem] sm2:top-[17rem] sm2:right-[1rem] font-semibold px-4 py-2 my-auto border-slate-400 rounded-xl shadow shadow-slate-300'>
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
