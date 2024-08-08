import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BiBookmark,
  BiBookmarkMinus,
  BiChat,
  BiDotsHorizontalRounded,
  BiEdit,
  BiGlobe,
  BiPencil,
  BiPlusCircle,
  BiTrashAlt,
} from 'react-icons/bi';
import { useCommon } from '../contexts/CommonContext';
import { useMediaQuery } from 'react-responsive';
import { BiArrowBack } from 'react-icons/bi';
import {
  FaChevronRight,
  FaGlobe,
  FaGlobeAfrica,
  FaGlobeAsia,
  FaRepublican,
} from 'react-icons/fa';
import { AiOutlineComment, AiOutlineGlobal } from 'react-icons/ai';

function HomePage() {
  const {
    handleOpenPostModal,
    postModal,
    postsList,
    usersList,
    imageUrlsList,
    setImageUrlsList,
    getAllUsers,
    getAuthorNameOfPostByUserId,
    getAuthorAvatarByUserId,
    addPostIconRef,
    logoutIconRef,
    ToastContainer,
    numberCharactersAllowed,
    getPostedTime,
    scrollContainerPostRef,
    scrollContainerCommentImageRef,
    handleSwipePostImage,
    handleSwipeCommentImage,
    adminInfor,
    openViewImageModal,
    setOpenViewImageModal,
    openViewImageCommentModal,
    setOpenViewImageCommentModal,
    handleOpenViewImageModal,
    handleOpenViewImageCommentModal,
    imageChoseToView,
    setImageChoseToView,
    decodeEntities,
    TextWithLinks,
    apiBaseUrl,
    handleSortImagesPath,
    handleSortImagesComment,
    handleSortImagesCommentPath,
    getImageUrlsByPostId,
    getImageUrlsCommentByPostId,
    lengthOfViewPostImage,
    setLengthOfViewPostImage,
    localUrlImages,
    setLocalUrlImages,
    commentsByPostId,
    setCommentsByPostId,
    getCommentsByPostId,
    chosenPost,
    setChosenPost,
    openAddCommentModal,
    setOpenAddCommentModal,
    openOptionsModal,
    setOpenOptionsModal,
    openCommentOptionsModal,
    setOpenCommentOptionsModal,
    openDeleteModal,
    setOpenDeleteModal,
    openDeleteCommentModal,
    setOpenDeleteCommentModal,
    openCancelEditingModal,
    setOpenCancelEditingModal,
    handleRemovePostWarning,
    handleRemoveCommentWarning,
    handleFinallyRemovePost,
    isEditing,
    setIsEditing,
    isEditingComment,
    setIsEditingComment,
    selectedCommentRemoveEdit,
    setSelectedCommentRemoveEdit,
    handleOpenEditingPost,
    handleOpenEditingComment,
    contentEditableRef,
    commentEditableRef,
    contentForUpdate,
    setContentForUpdate,
    contentBeforeUpdate,
    setContentBeforeUpdate,
    commentForUpdate,
    setCommentForUpdate,
    commentBeforeUpdate,
    setCommentBeforeUpdate,
    handleInputBlur,
    handleInputBlurComment,
    handleEditingPost,
    handleEditingComment,
    handleConfirmCancelEditingPost,
    handleConfirmCancelEditingComment,
    openCancelEditingCommentModal,
    setOpenCancelEditingCommentModal,
    handleDefinitelyCancelEditingPost,
    handleDefinitelyCancelEditingComment,
    redundantCommentCharactersNumber,
    setRedundantCommentCharactersNumber,
    redundantEditingCharactersNumber,
    setRedundantEditingCharactersNumber,
    redundantEditingCommentCharactersNumber,
    setRedundantEditingCommentCharactersNumber,
    isSuccessFullyRemoved,
    setIsSuccessFullyRemoved,
    localUrlImagesComment,
    setLocalUrlImagesComment,
    lengthOfViewPostImageComment,
    setLengthOfViewPostImageComment,
    imagesComment,
    setImagesComment,
    imageUrlsCommentList,
    setImageUrlsCommentList,
    findAttachItemsByCommentIdAfterSorting,
    setCurrentViewImageCommentIndex,
    role,
    setRole,
    currentUserInfor,
    setCurrentUserInfor,
    getAllPostsOfAdmin,
    getAllPostsExceptMe,
    viewPostDetails,
    setViewPostDetails,
    isScreenLessThan730Px,
    postDetailsRef,
    optionsModalRef,
    commentOptionsModalRef,
    handleSetOptionsModal,
    handleSetCommentOptionsModal,
    handleViewPostDetails,
  } = useCommon();

  // const contentEditableRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  // useEffect(() => {
  //   const checkRememberMeSession = async () => {
  //     try {
  //       await axios({
  //         method: 'post',
  //         url: '${apiBaseUrl}/users/checkrememberme',
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
  // }, []);

  useEffect(() => {
    if (!viewPostDetails) {
      setChosenPost(null);
    } else {
      getImageUrlsCommentByPostId(chosenPost);
    }
  }, [viewPostDetails, chosenPost]);

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

  useEffect(() => {
    if (viewPostDetails) {
      navigate('/post-details', { state: { from: location.pathname } });
    }
  }, [viewPostDetails, location.pathname]);

  useEffect(() => {
    if (currentUserInfor) {
      getAllPostsExceptMe();
    }
  }, []);

  return (
    <>
      <div className='header-feedscontent my-5'>
        <div className='feeds-content border-slate-300 rounded-3xl shadow shadow-gray-400 px-10 md:px-20 md:mx-10 lg:mx-14 py-7 md:py-10'>
          {/* //Home page screen with list of posts */}
          <>
            <div>
              {role && (
                <div className={`${postsList.length === 0 ? 'mb-0' : 'mb-5'}`}>
                  <div className=''>
                    <div className='feeds-content-posts-of-myself flex flex-row justify-between gap-3'>
                      <img
                        src={
                          currentUserInfor
                            ? currentUserInfor?.avatar_path ||
                              './user-avatar-default.png'
                            : adminInfor?.avatar_path
                        } //Thông tin của người đăng nhập hiện tại
                        alt=''
                        className='my-avatar basis-1/7 w-10 h-10 sm2:w-[50px] sm2:h-[50px] my-auto rounded-full bg-cover bg-no-repeat bg-center'
                      />
                      <input
                        className='post-input basis-[80%] hidden sm2:block tracking-wide'
                        type='text'
                        placeholder='Viết ra những suy nghĩ của bạn...'
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
                        Đăng
                      </button>
                    </div>

                    <hr
                      className={`${
                        postsList.length === 0
                          ? 'hidden'
                          : 'mt-3 border-slate-300'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* List of posts */}
            <div className='list-of-posts'>
              {postsList &&
                postsList.map((post, index) =>
                  index === 0 ? (
                    <div
                      onClick={() => handleViewPostDetails(post)}
                      key={post.post_id}
                      className='cursor-pointer text-sm sm2:text-base pb-10 sm2:pb-12'
                    >
                      <div className='feeds-content-posts grid relative'>
                        <div className='feeds-content-top-about absolute top-0 left-0'>
                          <img
                            src={
                              getAuthorAvatarByUserId(post.user_id) ||
                              './user-avatar-default.png'
                            }
                            alt=''
                            className='rounded-full w-10 h-10 sm2:w-12 sm2:h-12'
                          />
                        </div>
                        <div className='result-content absolute top-0 left-12 sm2:left-16 w-[80%] sm2:w-[88%]'>
                          <div className='information-and-posttime'>
                            <div className='author-name font-semibold'>
                              {getAuthorNameOfPostByUserId(post.user_id)}
                            </div>
                            <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                              <BiPencil />
                              <div className=''>
                                {getPostedTime(post.created_at)}
                              </div>
                            </div>
                            <div className='feeds-content-bottom-description whitespace-nowrap overflow-hidden overflow-ellipsis'>
                              {post.content || '* Bài viết không có tiêu đề'}
                            </div>
                          </div>
                        </div>
                        {index !== postsList.length - 1 ? (
                          <div className='absolute top-[75px] sm2:top-[85px] bg-slate-300 font-thin w-full h-[0.2px]'></div>
                        ) : (
                          <div className='absolute top-[75px] sm2:top-[85px] bg-white w-full h-[0.2px]'></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleViewPostDetails(post)}
                      key={post.post_id}
                      className='cursor-pointer text-sm sm2:text-base py-12'
                    >
                      <div className='feeds-content-posts grid relative'>
                        <div className='feeds-content-top-about absolute top-0 left-0'>
                          <img
                            src={
                              getAuthorAvatarByUserId(post.user_id) ||
                              './user-avatar-default.png'
                            }
                            alt=''
                            className='rounded-full w-10 h-10 sm2:w-12 sm2:h-12'
                          />
                        </div>
                        <div className='result-content absolute top-0 left-12 sm2:left-16 w-[80%] sm2:w-[88%]'>
                          <div className='information-and-posttime'>
                            <div className='author-name font-semibold'>
                              {getAuthorNameOfPostByUserId(post.user_id)}
                            </div>
                            <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                              <BiPencil />
                              <div className=''>
                                {getPostedTime(post.created_at)}
                              </div>
                            </div>
                            <div className='feeds-content-bottom-description whitespace-nowrap overflow-hidden overflow-ellipsis'>
                              {post.content || '* Bài viết không có tiêu đề'}
                            </div>
                          </div>
                        </div>
                        {index !== postsList.length - 1 ? (
                          <div className='absolute top-[75px] sm2:top-[85px] bg-slate-300 font-thin w-full h-[0.2px]'></div>
                        ) : (
                          <div className='absolute top-[75px] sm2:top-[85px] bg-white w-full h-[0.2px]'></div>
                        )}
                      </div>
                    </div>
                  )
                )}
            </div>
          </>
        </div>
      </div>
    </>
  );
}

export default HomePage;
