import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCommon } from '../contexts/CommonContext';
import {
  BiArrowBack,
  BiBookmark,
  BiBookmarkMinus,
  BiChat,
  BiDotsHorizontalRounded,
  BiEdit,
  BiPencil,
  BiTrashAlt,
} from 'react-icons/bi';
import { FaChevronRight } from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function ViewPostDetails() {
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
    getAllMyPosts,
    allMyPosts,
    setAllMyPosts,
    searchContent,
    setSearchContent,
    openChangePostStatusModal,
    setOpenChangePostStatusModal,
    statusOfCurrentChosenPost,
    setStatusOfCurrentChosenPost,
    updatePostStatus,
    getSavedPostByPostIdAndSaverId,
    isSavedPost,
    setIsSavedPost,
    allChosenUserProfilePosts,
    setAllChosenUserProfilePosts,
    chosenUserProfile,
    setChosenUserProfile,
    getAllPostsOfChosenUserProfile,
    getUserInformationOfChosenUserProfileByChosenPost,
    getUserInformationOfChosenUserProfileByCommentPost,
    getPostById,
  } = useCommon();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/'; // Đường dẫn mặc định nếu không có state

  const handleBack = () => {
    setViewPostDetails(false);
    setStatusOfCurrentChosenPost(null);
    setLocalUrlImages([]);
    setLengthOfViewPostImage(0);
    setCommentsByPostId([]);
    setIsEditingComment(false);
    setIsSuccessFullyRemoved(false);
    setImagesComment([]);
    setLocalUrlImagesComment([]);
    setChosenPost(null);
    setCurrentViewImageCommentIndex(null);
    setIsSavedPost(null);
    navigate(from);
    console.log('pho rom', from);
    if (from === '/profile' && chosenUserProfile === null) {
      //fetch lại all my post để cập nhật post mới nhất của bản thân ở profile
      getAllMyPosts();
    } else if (from === '/') {
      setViewPostDetails(false);
      if (currentUserInfor) {
        getAllPostsExceptMe();
      } else {
        getAllPostsOfAdmin();
      }
      setLocalUrlImages([]);
      setLengthOfViewPostImage(0);
      setCommentsByPostId([]);
      setIsEditingComment(false);
      setIsSuccessFullyRemoved(false);
      setImagesComment([]);
      setLocalUrlImagesComment([]);
      setCurrentViewImageCommentIndex(null);
    } else if (from === '/search') {
      setSearchContent('');
      setViewPostDetails(false);
      setLocalUrlImages([]);
      setLengthOfViewPostImage(0);
      setCommentsByPostId([]);
      setIsEditingComment(false);
      setIsSuccessFullyRemoved(false);
      setImagesComment([]);
      setLocalUrlImagesComment([]);
      setCurrentViewImageCommentIndex(null);
    }
  };

  const getCurrentStatusOfChosenPost = async () => {
    if (chosenPost) {
      const response = await axios.get(
        `${apiBaseUrl}/posts/current-status/${chosenPost.post_id}`
      );
      setStatusOfCurrentChosenPost(response.data[0].access_range);
    }
  };

  const handleSavePost = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/posts/saved-post/create-for-post/${chosenPost.post_id}`,
        {
          saver_user_id: currentUserInfor.user_id,
          author_user_id: chosenPost.user_id,
        }
      );
      if (response.status === 200) {
        setIsSavedPost(true);
        toast.success('Lưu bài đăng thành công 😸!');
      }
    } catch (error) {
      console.error('Error creating saved post by post id', error);
      toast.error('Lưu bài đăng thất bại. Vui lòng thử lại 😿.');
    }
  };

  const handleUnSavePost = async () => {
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/posts/saved-post/un-save-post/${chosenPost.post_id}`,
        {
          saver_user_id: currentUserInfor.user_id,
          author_user_id: chosenPost.user_id,
        }
      );
      if (response.status === 200) {
        setIsSavedPost(false);
        toast.success('Bỏ lưu bài đăng thành công 😸!');
      }
    } catch (error) {
      console.error('Error unsave post by post id', error);
      toast.error('Bỏ lưu bài đăng thất bại. Vui lòng thử lại 😿.');
    }
  };

  useEffect(() => {
    console.log('chosenuserprofile at viewpostdetail', chosenUserProfile);
  }, []);
  // const handleViewAuthorProfile = () => {
  //   //Chuyển tới trang profile nhưng với chosenUserProfile
  //   navigate('/profile');
  // };

  useEffect(() => {
    if (openChangePostStatusModal) {
      setOpenOptionsModal(false);
    }
    //truy vấn chosenPost có status hiện tại là gì
    getCurrentStatusOfChosenPost();
  }, [openChangePostStatusModal]);

  useEffect(() => {
    //Truy vấn liệu post hiện tại có nằm trong list saved post của currentUser không
    getSavedPostByPostIdAndSaverId();
  }, [isSavedPost, chosenPost]);

  return (
    <>
      <div className='my-5 wrapper-post-details feeds-content border-slate-300 rounded-3xl shadow shadow-gray-400 px-10 md:px-20 md:mx-10 lg:mx-14 py-7 md:py-10'>
        <button
          onClick={handleBack}
          className='text-2xl mb-1 rounded-full p-3 hover:bg-slate-100 cursor-pointer hover:-translate-x-1 duration-300 ease-in-out'
        >
          <BiArrowBack />
        </button>
        <div className='relative post-details max-w-screen-md mx-auto text-sm sm2:text-base'>
          {openOptionsModal && (
            <>
              <div
                id='options-modal-background'
                className='z-10 block sm2:hidden fixed top-0 left-0 w-full h-full bg-neutral-700 bg-opacity-90'
              ></div>
              <div
                ref={optionsModalRef}
                className='options-modal z-20 absolute w-full translate-y-3/4 sm2:translate-y-0 sm2:top-8 sm2:right-0 sm2:w-[170px] p-3 dropdown-options-post-details rounded-xl bg-white border border-slate-300 shadow shadow-slate-300'
              >
                <div className=''>
                  <div
                    onClick={isSavedPost ? handleUnSavePost : handleSavePost}
                    id='saved-unsaved-post'
                    className='cursor-pointer px-3 py-2 hover:bg-slate-100 hover:rounded-lg'
                  >
                    {isSavedPost ? (
                      // Bài viết đã được lưu => Click để bỏ lưu
                      <div className='grid grid-cols-12 '>
                        <div className='col-span-11'>Bỏ lưu</div>
                        <BiBookmarkMinus className='col-span-1 my-auto' />
                      </div>
                    ) : (
                      //Bài viết không được lưu => Click để lưu
                      <div className=' grid grid-cols-12'>
                        <div className='col-span-11'>Lưu bài viết</div>
                        <BiBookmark className='col-span-1 my-auto' />
                      </div>
                    )}
                  </div>
                  {currentUserInfor.user_id !== chosenPost.user_id ? (
                    ''
                  ) : (
                    <div>
                      <div
                        onClick={() => setOpenChangePostStatusModal(true)}
                        id='change-post-status'
                        className='grid grid-cols-12 cursor-pointer px-3 py-2 p-1 hover:bg-slate-100 hover:rounded-lg'
                      >
                        <div className='col-span-11'>Đổi trạng thái</div>
                        <FaChevronRight className='col-span-1 my-auto' />
                      </div>
                      <div
                        onClick={handleOpenEditingPost}
                        id='edit-post'
                        className='grid grid-cols-12 cursor-pointer px-3 py-2 p-1 hover:bg-slate-100 hover:rounded-lg'
                      >
                        <div className='col-span-11'>Chỉnh sửa</div>
                        <BiEdit className='col-span-1 my-auto' />
                      </div>
                      <div
                        onClick={handleRemovePostWarning}
                        id='delete-post'
                        className='delete-post grid grid-cols-12 text-red-500 cursor-pointer px-3 py-2 p-1 hover:bg-slate-100 hover:rounded-lg'
                      >
                        <div className='col-span-11'>Xoá bài </div>
                        <BiTrashAlt className='col-span-1 my-auto' />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Modal change post status*/}
          {openChangePostStatusModal && (
            <>
              <div
                id='background-change-post-status-modal'
                className='z-[1001] fixed top-0 left-0 w-full h-full bg-neutral-700 bg-opacity-90'
              >
                <div className='w-full h-full flex justify-center items-center'>
                  <div id='change-post-status-modal' className='relative z-20'>
                    <div className='bg-white w-[220px] rounded-2xl p-5'>
                      {/* Radio button for change post status */}
                      <div className='w-full px-3 py-2 relative mb-2'>
                        <input
                          checked={statusOfCurrentChosenPost === 'public'}
                          onChange={() => {
                            setStatusOfCurrentChosenPost('public');
                          }}
                          className='vulv-radio-button scale-125 sm2:scale-150 cursor-pointer'
                          type='radio'
                          name='post_status'
                        />
                        <div className='absolute top-[0.35rem] right-3'>
                          Công khai
                        </div>
                      </div>
                      <div className='w-full px-3 py-2 relative mb-2'>
                        <input
                          checked={statusOfCurrentChosenPost === 'private'}
                          onChange={() => {
                            setStatusOfCurrentChosenPost('private');
                          }}
                          className='vulv-radio-button scale-125 sm2:scale-150 cursor-pointer'
                          type='radio'
                          name='post_status'
                        />
                        <div className='absolute top-[0.35rem] right-3'>
                          Riêng tư
                        </div>
                      </div>
                      <div
                        onClick={updatePostStatus}
                        className='mb-2 font-semibold cursor-pointer w-full px-3 py-2 text-center rounded-xl border border-slate-200 text-white bg-black hover:bg-slate-800 duration-300 ease-in-out'
                      >
                        Cập nhật
                      </div>
                      <div
                        onClick={() => {
                          setOpenChangePostStatusModal(false);
                        }}
                        className='cursor-pointer w-full px-3 py-2 text-center rounded-xl border border-slate-200 hover:bg-slate-200  duration-300 ease-in-out'
                      >
                        Đóng
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Modal delete post */}
          {openDeleteModal && (
            <>
              <div
                id='background-delete-post-modal'
                className='z-10 fixed top-0 left-0 w-full h-full bg-neutral-700 bg-opacity-90'
              >
                <div className='w-full h-full flex justify-center items-center'>
                  <div id='delete-post-modal' className='relative z-20'>
                    <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                      <div className='mb-4'>
                        <div className='font-semibold text-center mb-4'>
                          Xoá bài đăng?
                        </div>
                        <div className='text-center mb-3'>
                          Sau khi xoá, bạn sẽ không thể khôi phục.
                        </div>
                      </div>
                      <hr className='' />
                      <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                        <div
                          id='cancel-final-delete-post'
                          onClick={() => setOpenDeleteModal(false)}
                          className='col-span-1 cursor-pointer p-2'
                        >
                          Huỷ
                        </div>
                        <div
                          onClick={handleFinallyRemovePost}
                          id='finally-delete-post'
                          className='col-span-1 font-bold tracking-wide p-2 text-red-500 cursor-pointer'
                        >
                          Xoá
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* View information details of post */}
          <div className='details-chosen-post grid grid-cols-12 relative'>
            <div className='col-span-1'>
              {/* avatar */}
              <img
                onClick={getUserInformationOfChosenUserProfileByChosenPost} //Lấy thông tin của author của bài viết chosenPost để xem profile
                src={
                  chosenPost &&
                  getAuthorAvatarByUserId(chosenPost.user_id).includes(
                    'https://res.cloudinary.com'
                  )
                    ? 'https://res.cloudinary.com' +
                      (
                        chosenPost &&
                        getAuthorAvatarByUserId(chosenPost.user_id)
                      ).split('https://res.cloudinary.com')[1]
                    : (chosenPost &&
                        getAuthorAvatarByUserId(chosenPost.user_id)) ||
                      './user-avatar-default.png'
                }
                alt=''
                className='cursor-pointer my-avatar absolute top-0 left-0 w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
              />
            </div>
            <div className='col-span-11 flex flex-col'>
              {/* Author and post time*/}
              <div className='flex justify-between'>
                <div className='name-and-postedat absolute top-0 left-12 sm2:left-16'>
                  <div className='font-semibold'>
                    {chosenPost &&
                      getAuthorNameOfPostByUserId(chosenPost.user_id)}
                  </div>
                  <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                    <BiPencil />
                    <div className=''>
                      {chosenPost && getPostedTime(chosenPost.created_at)}
                    </div>
                  </div>
                </div>
                {!role ? (
                  ''
                ) : (
                  <div
                    onClick={handleSetOptionsModal}
                    className='absolute -top-2 right-0 duration-300 ease-in-out text-xl sm2:text-2xl cursor-pointer rounded-full p-1 hover:bg-slate-100'
                  >
                    <BiDotsHorizontalRounded />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Editing mode */}
          {isEditing ? (
            <div className='wrapper-editing mt-14 md:mt-16 relative'>
              <div className='redundant-editing-characters-number absolute -top-9 right-2 text-red-600 tracking-wide'>
                {redundantEditingCharactersNumber < 0
                  ? redundantEditingCharactersNumber
                  : ''}
              </div>
              <div
                id='feeds-content-bottom-description'
                className='break-words whitespace-pre-wrap leading-7'
                contentEditable={true}
                ref={contentEditableRef}
                onBlur={handleInputBlur}
                suppressContentEditableWarning={true} // Để tránh cảnh báo từ React
              >
                {decodeEntities(contentForUpdate)}
                {/* same with {chosenPost.content} */}
              </div>
              <div className='relative h-16'>
                <div
                  onClick={handleConfirmCancelEditingPost}
                  id='button-cancel-edit-post'
                  className='absolute right-28 bottom-0 cursor-pointer font-semibold px-4 py-2 my-auto text-red-500 duration-300 ease-in-out'
                >
                  Huỷ
                </div>
                <div
                  onClick={handleEditingPost}
                  id='button-edit-post'
                  className='absolute right-0 bottom-0 cursor-pointer font-semibold px-4 py-2 my-auto border-slate-300 rounded-xl shadow shadow-slate-300'
                >
                  Cập nhật
                </div>
              </div>

              {/* Cancel Editing Modal */}
              {openCancelEditingModal && (
                <div
                  id='background-cancel-editing-modal'
                  className='z-10 fixed top-0 left-0 w-full h-full bg-neutral-700 bg-opacity-90'
                >
                  <div className='w-full h-full flex justify-center items-center'>
                    <div id='cancel-deleting-modal' className='relative z-20'>
                      <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                        <div className='font-semibold text-center mb-4'>
                          Huỷ bỏ thay đổi?
                        </div>
                        <hr className='' />
                        <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                          <div
                            id='continue-edit'
                            onClick={() => setOpenCancelEditingModal(false)}
                            className='col-span-1 cursor-pointer p-2'
                          >
                            Không
                          </div>
                          <div
                            onClick={handleDefinitelyCancelEditingPost}
                            id='finally-edit'
                            className='col-span-1 font-bold tracking-wide p-2 text-red-500 cursor-pointer'
                          >
                            Huỷ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Default content of post details
            <div
              id='feeds-content-bottom-description'
              className='mt-14 md:mt-16'
            >
              <div className='content-description break-words whitespace-pre-wrap leading-7'>
                {TextWithLinks(contentForUpdate)}
              </div>
              {/* Post chỉ có một ảnh duy nhất */}
              {localUrlImages.length === 1 ? (
                <div className=''>
                  <div className='content-attachments w-[95%] mt-4 cursor-pointer mx-auto'>
                    <img
                      onClick={(e) => handleOpenViewImageModal(e)}
                      src={`${
                        localUrlImages[0]?.attacheditem_path.includes(
                          'https://res.cloudinary.com/'
                        )
                          ? `${localUrlImages[0]?.attacheditem_path}`
                          : `${apiBaseUrl}${localUrlImages[0]?.attacheditem_path}`
                      }`}
                      alt={`${apiBaseUrl}${localUrlImages[0]?.attacheditem_path}`}
                      className='rounded-lg mx-auto'
                    />
                  </div>
                  {/* Commments of post with 1 image */}
                  <div className='comments-of-post-details flex items-center justify-between mt-4'>
                    <div className='flex gap-2'>
                      <AiOutlineComment className='text-3xl ' />
                      <div className='number-of-comments text-lg '>
                        {commentsByPostId && commentsByPostId.length}
                      </div>
                    </div>
                    {!role ? (
                      ''
                    ) : (
                      <div
                        onClick={() => setOpenAddCommentModal(true)}
                        className='flex items-center gap-2 text-2xl p-2 ease-in-out duration-300 hover:bg-slate-100 hover:rounded-xl cursor-pointer'
                      >
                        <BiChat />
                        <div className='text-lg'>Bình luận</div>
                      </div>
                    )}
                  </div>

                  {commentsByPostId.length > 0 && <hr className='mt-2' />}
                  {/* Wrapper of post comments */}
                  {isEditingComment ? (
                    //------------------------- Editing Comment Mode-----------------------
                    <div className='wrapper-of-post-comment-editing-mode'>
                      <div className='comments-by-post-id details-of-post-comments mt-5 flex gap-3'>
                        <div className='flex-shrink-0'>
                          <img
                            className='comment-owner w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                            src={
                              usersList.find(
                                (user) =>
                                  user.user_id ===
                                  selectedCommentRemoveEdit.user_id
                              )?.avatar_path || './user-avatar-default.png'
                            }
                            alt='infor-user-comment'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='author-name font-semibold'>
                            {
                              usersList.find(
                                (user) =>
                                  user.user_id ===
                                  selectedCommentRemoveEdit.user_id
                              )?.username
                            }
                          </div>
                          <div className='created-at flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                            <BiPencil />
                            <div className=''>
                              {getPostedTime(
                                selectedCommentRemoveEdit.created_at
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cancel Editing Comment Modal */}
                        {openCancelEditingCommentModal && (
                          <div
                            id='background-cancel-editing-comment-modal'
                            className='z-[1000] fixed top-0 left-0 w-full h-full bg-neutral-700 bg-opacity-90'
                          >
                            <div className='w-full h-full flex justify-center items-center'>
                              <div
                                id='cancel-editing-comment-modal'
                                className='relative z-20'
                              >
                                <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                                  <div className='font-semibold text-center mb-4'>
                                    Huỷ bỏ thay đổi?
                                  </div>
                                  <hr className='' />
                                  <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                                    <div
                                      id='continue-edit-comment'
                                      onClick={() =>
                                        setOpenCancelEditingCommentModal(false)
                                      }
                                      className='col-span-1 cursor-pointer p-2'
                                    >
                                      Không
                                    </div>
                                    <div
                                      onClick={
                                        handleDefinitelyCancelEditingComment
                                      }
                                      id='finally-edit-comment'
                                      className='col-span-1 font-bold tracking-wide p-2 text-red-500 cursor-pointer'
                                    >
                                      Huỷ
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='flex-1'>
                        <div className='relative leading-loose break-words whitespace-pre-wrap font-semibold flex justify-between'>
                          <div className='redundant-editing-comment-characters-number absolute -top-7 right-3 text-red-600 tracking-wide'>
                            {redundantEditingCommentCharactersNumber < 0
                              ? redundantEditingCommentCharactersNumber
                              : ''}
                          </div>
                        </div>
                        <div
                          contentEditable={true}
                          ref={commentEditableRef}
                          onBlur={handleInputBlurComment}
                          suppressContentEditableWarning={true}
                          className='outline-none leading-loose break-words whitespace-pre-wrap mt-3'
                        >
                          {decodeEntities(commentForUpdate)}
                        </div>
                        <div className='relative h-14'>
                          <div
                            onClick={handleConfirmCancelEditingComment}
                            id='button-cancel-edit-comment'
                            className='absolute right-28 bottom-0 cursor-pointer font-semibold px-4 py-2 my-auto text-red-500 duration-300 ease-in-out'
                          >
                            Huỷ
                          </div>
                          <div
                            onClick={handleEditingComment}
                            id='button-edit-comment'
                            className='absolute right-0 bottom-0 cursor-pointer font-semibold px-4 py-2 my-auto border-slate-300 rounded-xl shadow shadow-slate-300'
                          >
                            Cập nhật
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='wrapper-of-post-comments'>
                      {commentsByPostId &&
                        commentsByPostId.map((comment, index) => (
                          <div key={index}>
                            <div className='wrapper-2-of-post-comments'>
                              <div className='comments-by-post-id details-of-post-comments mt-5 flex gap-3'>
                                <div className='flex-shrink-0'>
                                  <img
                                    onClick={() =>
                                      getUserInformationOfChosenUserProfileByCommentPost(
                                        comment
                                      )
                                    }
                                    className='cursor-pointer comment-owner w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                                    src={
                                      usersList.find(
                                        (user) =>
                                          user.user_id === comment.user_id
                                      )?.avatar_path ||
                                      './user-avatar-default.png'
                                    }
                                    alt='infor-user-comment'
                                  />
                                </div>
                                <div className='flex-1'>
                                  <div className='author-name font-semibold'>
                                    {
                                      usersList.find(
                                        (user) =>
                                          user.user_id === comment.user_id
                                      )?.username
                                    }
                                  </div>
                                  <div className='created-at flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                                    <BiPencil />
                                    <div className=''>
                                      {getPostedTime(comment.created_at)}
                                    </div>
                                  </div>
                                </div>
                                {/* //KHÔNG đăng nhập hoặc KHÔNG phải comment của mình thì không được sửa - được xoá nếu đó là post của mình*/}
                                {/* {!role || comment.user_id === currentUserInfor.user_id} */}
                                {/* Người đăng bài và người comment là cùng 1 người */}
                                {!role ||
                                (currentUserInfor.user_id !==
                                  chosenPost.user_id &&
                                  currentUserInfor.user_id !==
                                    comment.user_id) ? (
                                  ''
                                ) : (
                                  <div
                                    onClick={() =>
                                      handleSetCommentOptionsModal(
                                        index,
                                        comment
                                      )
                                    }
                                    className='options-icon duration-300 ease-in-out text-xl sm2:text-2xl cursor-pointer rounded-full h-full p-1 my-auto hover:bg-slate-100'
                                  >
                                    <BiDotsHorizontalRounded />
                                  </div>
                                )}
                              </div>
                              <div className='flex-1'>
                                <div className='relative leading-loose break-words whitespace-pre-wrap font-semibold flex justify-between'>
                                  {/* Comment options modal */}
                                  {openCommentOptionsModal === index && (
                                    <div
                                      ref={commentOptionsModalRef}
                                      className='comment-options-modal z-20 absolute translate-y-0 top-0 right-0 w-[170px] p-3 dropdown-options-post-details rounded-xl bg-white border border-slate-300 shadow shadow-slate-300'
                                    >
                                      <div>
                                        {chosenPost.user_id ===
                                          comment.user_id ||
                                        (chosenPost.user_id !==
                                          comment.user_id &&
                                          currentUserInfor.user_id ===
                                            comment.user_id) ? (
                                          <div
                                            onClick={handleOpenEditingComment}
                                            id='edit-post'
                                            className='grid grid-cols-12 cursor-pointer px-3 py-2 p-1 hover:bg-slate-100 hover:rounded-lg'
                                          >
                                            <div className='col-span-11'>
                                              Chỉnh sửa
                                            </div>
                                            <BiEdit className='col-span-1 my-auto' />
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                        <div
                                          onClick={handleRemoveCommentWarning}
                                          id='delete-post'
                                          className='delete-post grid grid-cols-12 text-red-500 cursor-pointer px-3 py-2 p-1 hover:bg-slate-100 hover:rounded-lg'
                                        >
                                          <div className='col-span-11'>
                                            Xoá bình luận
                                          </div>
                                          <BiTrashAlt className='col-span-1 my-auto' />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className='leading-loose break-words whitespace-pre-wrap mt-3'>
                                  {TextWithLinks(comment?.comment_content)}
                                </div>
                                {/*-------------------- View Images of comments ------------------*/}
                                <div
                                  ref={(element) =>
                                    (scrollContainerCommentImageRef.current[
                                      index
                                    ] = element)
                                  }
                                  onMouseDown={(e) =>
                                    handleSwipeCommentImage(e, index, comment)
                                  }
                                  onDragStart={(e) => e.preventDefault()}
                                  className={`rounded-lg wrapper-images-of-comment-images vulv-uploaded-images vulv-scrollbar-hide overflow-x-auto mt-1 ${
                                    (localUrlImagesComment &&
                                      // handleSortImagesCommentPath(
                                      //   localUrlImagesComment
                                      // ).find(
                                      //   (image) =>
                                      //     image.comment_id ===
                                      //     comment.comment_id
                                      // )?.attached_items
                                      findAttachItemsByCommentIdAfterSorting(
                                        comment
                                      ).length > 2) ||
                                    (findAttachItemsByCommentIdAfterSorting(
                                      comment
                                    ).length === 2 &&
                                      isScreenLessThan730Px)
                                      ? 'border border-slate-300'
                                      : ''
                                  }`}
                                >
                                  <div className='flex gap-2 w-max'>
                                    {/* Post có nhiều ảnh đính kèm */}
                                    {localUrlImagesComment &&
                                      // handleSortImagesCommentPath(
                                      //   localUrlImagesComment
                                      // )
                                      //   .find(
                                      //     (imageComment) =>
                                      //       imageComment.comment_id ===
                                      //       comment.comment_id
                                      //   )
                                      //   ?.attached_items
                                      findAttachItemsByCommentIdAfterSorting(
                                        comment
                                      ).map((imgurlComment, index) => (
                                        <div
                                          key={index}
                                          className='w-full content-attachments cursor-pointer'
                                        >
                                          <img
                                            onClick={(e) =>
                                              handleOpenViewImageCommentModal(e)
                                            }
                                            src={`${
                                              imgurlComment?.attacheditem_comment_path.includes(
                                                'https://res.cloudinary.com/'
                                              )
                                                ? `${imgurlComment?.attacheditem_comment_path} `
                                                : `${apiBaseUrl}${imgurlComment?.attacheditem_comment_path}`
                                            }`}
                                            alt={`${apiBaseUrl}${imgurlComment?.attacheditem_comment_path}`}
                                            className='shadow shadow-slate-300 h-full w-[300px] object-cover rounded-lg mx-auto'
                                          />
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {index !== commentsByPostId.length - 1 && (
                              <hr className='my-2' />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className='wrapper-of-post-details'>
                  <div
                    ref={scrollContainerPostRef}
                    onMouseDown={(e) => handleSwipePostImage(e)}
                    onDragStart={(e) => e.preventDefault()}
                    className={`${
                      localUrlImages.length > 0
                        ? 'rounded-lg border border-slate-300 wrapper-images-of-post-details vulv-uploaded-images vulv-scrollbar-hide overflow-x-auto mt-4'
                        : ''
                    }`}
                  >
                    <div className='flex gap-2 w-max'>
                      {/* Post có nhiều ảnh đính kèm */}
                      {localUrlImages.length > 1 &&
                        handleSortImagesPath(localUrlImages).map(
                          (imgurl, index) => (
                            <div
                              key={index}
                              className='content-attachments cursor-pointer'
                            >
                              <img
                                onClick={(e) => handleOpenViewImageModal(e)}
                                src={`${
                                  imgurl?.attacheditem_path.includes(
                                    'https://res.cloudinary.com/'
                                  )
                                    ? imgurl?.attacheditem_path
                                    : `${apiBaseUrl}${imgurl?.attacheditem_path}`
                                }`}
                                alt='attached items'
                                className='shadow shadow-slate-300 h-[40vh] sm:h-[50vh] w-[250px] sm:w-[450px] object-cover rounded-lg mx-auto'
                              />
                            </div>
                          )
                        )}
                    </div>
                  </div>
                  {/* Commments of post with more than 1 image */}
                  <div className='comments-of-post-details flex items-center justify-between mt-4'>
                    <div className='flex gap-2'>
                      <AiOutlineComment className='text-3xl ' />
                      <div className='number-of-comments text-lg '>
                        {commentsByPostId && commentsByPostId.length}
                      </div>
                    </div>
                    {!role ? (
                      ''
                    ) : (
                      <div
                        onClick={() => setOpenAddCommentModal(true)}
                        className='flex items-center gap-2 text-2xl p-2 ease-in-out duration-300 hover:bg-slate-100 hover:rounded-xl cursor-pointer'
                      >
                        <BiChat />
                        <div className='text-lg'>Bình luận</div>
                      </div>
                    )}
                  </div>
                  {commentsByPostId.length > 0 && <hr className='mt-2' />}
                  {/* Wrapper of post comments */}
                  {isEditingComment ? (
                    //------------------------- Editing Comment Mode-----------------------
                    <div className='wrapper-of-post-comment-editing-mode'>
                      <div className='comments-by-post-id details-of-post-comments mt-5 flex gap-3'>
                        <div className='flex-shrink-0'>
                          <img
                            className='comment-owner w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                            src={
                              usersList.find(
                                (user) =>
                                  user.user_id ===
                                  selectedCommentRemoveEdit.user_id
                              )?.avatar_path || './user-avatar-default.png'
                            }
                            alt='infor-user-comment'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='author-name font-semibold'>
                            {
                              usersList.find(
                                (user) =>
                                  user.user_id ===
                                  selectedCommentRemoveEdit.user_id
                              )?.username
                            }
                          </div>
                          <div className='created-at flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                            <BiPencil />
                            <div className=''>
                              {getPostedTime(
                                selectedCommentRemoveEdit.created_at
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cancel Editing Comment Modal */}
                        {openCancelEditingCommentModal && (
                          <div
                            id='background-cancel-editing-comment-modal'
                            className='z-[1000] fixed top-0 left-0 w-full h-full bg-neutral-700 bg-opacity-90'
                          >
                            <div className='w-full h-full flex justify-center items-center'>
                              <div
                                id='cancel-editing-comment-modal'
                                className='relative z-20'
                              >
                                <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                                  <div className='font-semibold text-center mb-4'>
                                    Huỷ bỏ thay đổi?
                                  </div>
                                  <hr className='' />
                                  <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                                    <div
                                      id='continue-edit-comment'
                                      onClick={() =>
                                        setOpenCancelEditingCommentModal(false)
                                      }
                                      className='col-span-1 cursor-pointer p-2'
                                    >
                                      Không
                                    </div>
                                    <div
                                      onClick={
                                        handleDefinitelyCancelEditingComment
                                      }
                                      id='finally-edit-comment'
                                      className='col-span-1 font-bold tracking-wide p-2 text-red-500 cursor-pointer'
                                    >
                                      Huỷ
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='flex-1'>
                        <div className='relative leading-loose break-words whitespace-pre-wrap font-semibold flex justify-between'>
                          <div className='redundant-editing-comment-characters-number absolute -top-7 right-3 text-red-600 tracking-wide'>
                            {redundantEditingCommentCharactersNumber < 0
                              ? redundantEditingCommentCharactersNumber
                              : ''}
                          </div>
                        </div>
                        <div
                          contentEditable={true}
                          ref={commentEditableRef}
                          onBlur={handleInputBlurComment}
                          suppressContentEditableWarning={true}
                          className='outline-none leading-loose break-words whitespace-pre-wrap mt-3'
                        >
                          {decodeEntities(commentForUpdate)}
                        </div>
                        <div className='relative h-14'>
                          <div
                            onClick={handleConfirmCancelEditingComment}
                            id='button-cancel-edit-comment'
                            className='absolute right-28 bottom-0 cursor-pointer font-semibold px-4 py-2 my-auto text-red-500 duration-300 ease-in-out'
                          >
                            Huỷ
                          </div>
                          <div
                            onClick={handleEditingComment}
                            id='button-edit-comment'
                            className='absolute right-0 bottom-0 cursor-pointer font-semibold px-4 py-2 my-auto border-slate-300 rounded-xl shadow shadow-slate-300'
                          >
                            Cập nhật
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='wrapper-of-post-comments'>
                      {commentsByPostId &&
                        commentsByPostId.map((comment, index) => (
                          <div key={index}>
                            <div className='wrapper-2-of-post-comments'>
                              <div className='comments-by-post-id details-of-post-comments mt-5 flex gap-3'>
                                <div className='flex-shrink-0'>
                                  <img
                                    onClick={() =>
                                      getUserInformationOfChosenUserProfileByCommentPost(
                                        comment
                                      )
                                    }
                                    className='cursor-pointer comment-owner w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                                    src={
                                      usersList.find(
                                        (user) =>
                                          user.user_id === comment.user_id
                                      )?.avatar_path ||
                                      './user-avatar-default.png'
                                    }
                                    alt='infor-user-comment'
                                  />
                                </div>
                                <div className='flex-1'>
                                  <div className='author-name font-semibold'>
                                    {
                                      usersList.find(
                                        (user) =>
                                          user.user_id === comment.user_id
                                      )?.username
                                    }
                                  </div>
                                  <div className='created-at flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                                    <BiPencil />
                                    <div className=''>
                                      {getPostedTime(comment.created_at)}
                                    </div>
                                  </div>
                                </div>
                                {!role ||
                                (currentUserInfor.user_id !==
                                  chosenPost.user_id &&
                                  currentUserInfor.user_id !==
                                    comment.user_id) ? (
                                  ''
                                ) : (
                                  <div
                                    onClick={() =>
                                      handleSetCommentOptionsModal(
                                        index,
                                        comment
                                      )
                                    }
                                    className='options-icon duration-300 ease-in-out text-xl sm2:text-2xl cursor-pointer rounded-full h-full p-1 my-auto hover:bg-slate-100'
                                  >
                                    <BiDotsHorizontalRounded />
                                  </div>
                                )}
                              </div>
                              <div className='flex-1'>
                                <div className='relative leading-loose break-words whitespace-pre-wrap font-semibold flex justify-between'>
                                  {/* Comment options modal */}
                                  {openCommentOptionsModal === index && (
                                    <div
                                      ref={commentOptionsModalRef}
                                      className='comment-options-modal z-20 absolute translate-y-0 top-0 right-0 w-[170px] p-3 dropdown-options-post-details rounded-xl bg-white border border-slate-300 shadow shadow-slate-300'
                                    >
                                      <div>
                                        {chosenPost.user_id ===
                                          comment.user_id ||
                                        (chosenPost.user_id !==
                                          comment.user_id &&
                                          currentUserInfor.user_id ===
                                            comment.user_id) ? (
                                          <div
                                            onClick={handleOpenEditingComment}
                                            id='edit-post'
                                            className='grid grid-cols-12 cursor-pointer px-3 py-2 p-1 hover:bg-slate-100 hover:rounded-lg'
                                          >
                                            <div className='col-span-11'>
                                              Chỉnh sửa
                                            </div>
                                            <BiEdit className='col-span-1 my-auto' />
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                        <div
                                          onClick={handleRemoveCommentWarning}
                                          id='delete-post'
                                          className='delete-post grid grid-cols-12 text-red-500 cursor-pointer px-3 py-2 p-1 hover:bg-slate-100 hover:rounded-lg'
                                        >
                                          <div className='col-span-11'>
                                            Xoá bình luận
                                          </div>
                                          <BiTrashAlt className='col-span-1 my-auto' />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className='leading-loose break-words whitespace-pre-wrap mt-3'>
                                  {TextWithLinks(comment?.comment_content)}
                                </div>
                                {/*-------------------- View Images of comments ------------------*/}
                                <div
                                  ref={(element) =>
                                    (scrollContainerCommentImageRef.current[
                                      index
                                    ] = element)
                                  }
                                  onMouseDown={(e) =>
                                    handleSwipeCommentImage(e, index, comment)
                                  }
                                  onDragStart={(e) => e.preventDefault()}
                                  className={`rounded-lg wrapper-images-of-comment-images vulv-uploaded-images vulv-scrollbar-hide overflow-x-auto mt-1 ${
                                    (localUrlImagesComment &&
                                      // handleSortImagesCommentPath(
                                      //   localUrlImagesComment
                                      // ).find(
                                      //   (image) =>
                                      //     image.comment_id ===
                                      //     comment.comment_id
                                      // )?.attached_items
                                      findAttachItemsByCommentIdAfterSorting(
                                        comment
                                      ).length > 2) ||
                                    (findAttachItemsByCommentIdAfterSorting(
                                      comment
                                    ).length === 2 &&
                                      isScreenLessThan730Px)
                                      ? 'border border-slate-300'
                                      : ''
                                  }`}
                                >
                                  <div className='flex gap-2 w-max'>
                                    {/* Post có nhiều ảnh đính kèm */}
                                    {localUrlImagesComment &&
                                      // handleSortImagesCommentPath(
                                      //   localUrlImagesComment
                                      // )
                                      //   .find(
                                      //     (imageComment) =>
                                      //       imageComment.comment_id ===
                                      //       comment.comment_id
                                      //   )
                                      //   ?.attached_items
                                      findAttachItemsByCommentIdAfterSorting(
                                        comment
                                      ).map((imgurlComment, index) => (
                                        <div
                                          key={index}
                                          className='w-full content-attachments cursor-pointer'
                                        >
                                          <img
                                            onClick={(e) =>
                                              handleOpenViewImageCommentModal(e)
                                            }
                                            src={`${
                                              imgurlComment?.attacheditem_comment_path.includes(
                                                'https://res.cloudinary.com/'
                                              )
                                                ? imgurlComment?.attacheditem_comment_path
                                                : `${apiBaseUrl}${imgurlComment?.attacheditem_comment_path}`
                                            }`}
                                            alt={`${apiBaseUrl}${imgurlComment?.attacheditem_comment_path}`}
                                            className='shadow shadow-slate-300 h-full w-[300px] object-cover rounded-lg mx-auto'
                                          />
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {index !== commentsByPostId.length - 1 && (
                              <hr className='my-2' />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewPostDetails;
