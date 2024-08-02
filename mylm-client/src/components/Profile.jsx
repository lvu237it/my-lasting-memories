import { useState, useEffect } from 'react';
import { useCommon } from '../contexts/CommonContext';
import {
  BiArrowBack,
  BiBookmark,
  BiBookmarkMinus,
  BiChat,
  BiDotsHorizontalRounded,
  BiEdit,
  BiPencil,
  BiPlusCircle,
  BiTrashAlt,
} from 'react-icons/bi';
import { FaChevronRight } from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';

import ViewPostDetails from './ViewPostDetails';
import { useLocation, useNavigate } from 'react-router-dom';
function Profile() {
  const location = useLocation();
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
    getAllMyPosts,
    allMyPosts,
    setAllMyPosts,
  } = useCommon();
  const navigate = useNavigate();

  useEffect(() => {
    if (viewPostDetails) {
      navigate('/post-details', { state: { from: location.pathname } });
    }
  }, [viewPostDetails, location.pathname]);

  return (
    <>
      <div className='header-feedscontent my-5'>
        <div className='feeds-content border-slate-300 rounded-3xl shadow shadow-gray-400 px-10 md:px-20 md:mx-10 lg:mx-14 py-7 md:py-10'>
          <div className='default-profile'>
            <div className='personal-information flex justify-between items-center mb-5'>
              <div className='flex-1'>
                <div className='username font-semibold text-2xl'>
                  {currentUserInfor
                    ? currentUserInfor?.username
                    : adminInfor?.username}
                </div>
                <div className='social-url italic'>nickname...</div>
              </div>
              <div className='avatar-infor shrink-0'>
                <img
                  src={
                    currentUserInfor
                      ? currentUserInfor?.avatar_path
                      : adminInfor?.avatar_path
                  }
                  alt='avatar-infor'
                  className='w-[80px] h-[80px] rounded-full bg-cover bg-no-repeat bg-center'
                />
              </div>
            </div>
            <div
              className={`whitespace-pre-wrap break-words ${
                role ? 'mb-5' : ''
              }`}
            >
              Tiểu sử chưa được cập nhật...
            </div>
            {role && (
              <div className='mb-5 border border-slate-300 rounded-2xl hover:bg-slate-50 duration-300 ease-in-out text-center py-2 cursor-pointer'>
                Chỉnh sửa thông tin
              </div>
            )}
            {/* default profile with list of posts of myself*/}
            <div>
              <div>
                {role && (
                  <div
                    className={`${allMyPosts.length === 0 ? 'mb-0' : 'mb-5'}`}
                  >
                    <div className=''>
                      <div className='feeds-content-posts-of-myself flex flex-row justify-between gap-3'>
                        <img
                          src={currentUserInfor && currentUserInfor.avatar_path} //Thông tin của người đăng nhập hiện tại
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
                          allMyPosts.length === 0
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
                {allMyPosts &&
                  allMyPosts.map((post, index) =>
                    index === 0 ? (
                      <div
                        onClick={() => handleViewPostDetails(post)}
                        key={post.post_id}
                        className='cursor-pointer text-sm sm2:text-base pb-10 sm2:pb-12'
                      >
                        <div className='feeds-content-posts grid relative'>
                          <div className='feeds-content-top-about absolute top-0 left-0'>
                            <img
                              src={getAuthorAvatarByUserId(post.user_id)}
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
                          {index !== allMyPosts.length - 1 ? (
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
                              src={getAuthorAvatarByUserId(post.user_id)}
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
                          {index !== allMyPosts.length - 1 ? (
                            <div className='absolute top-[75px] sm2:top-[85px] bg-slate-300 font-thin w-full h-[0.2px]'></div>
                          ) : (
                            <div className='absolute top-[75px] sm2:top-[85px] bg-white w-full h-[0.2px]'></div>
                          )}
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
