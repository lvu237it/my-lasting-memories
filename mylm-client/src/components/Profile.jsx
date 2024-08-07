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

import { useLocation, useNavigate } from 'react-router-dom';
import MyOwnPosts from './MyOwnPosts';
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
    openEditUserInformationModal,
    setOpenEditUserInformationModal,
  } = useCommon();
  const navigate = useNavigate();

  useEffect(() => {
    if (!viewPostDetails) {
      setChosenPost(null);
    } else {
      getImageUrlsCommentByPostId(chosenPost);
    }
  }, [viewPostDetails, chosenPost]);

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
                <div className='social-url italic tracking-widest'>
                  {currentUserInfor
                    ? currentUserInfor?.nickname ||
                      'Tạo cho mình 1 chiếc nickname thật ngầu...'
                    : adminInfor?.nickname}
                </div>
              </div>
              <div className='avatar-infor shrink-0'>
                <img
                  onClick={() =>
                    window.alert(
                      'Chức năng này đang trong quá trình triển khai. Chờ nha 😸!'
                    )
                  }
                  src={
                    currentUserInfor
                      ? currentUserInfor?.avatar_path ||
                        './user-avatar-default.png'
                      : adminInfor?.avatar_path
                  }
                  alt='avatar-infor'
                  className='cursor-pointer w-[80px] h-[80px] rounded-full bg-cover bg-no-repeat bg-center'
                />
              </div>
            </div>
            <div
              className={`whitespace-pre-wrap break-words italic ${
                role ? 'mb-5' : ''
              }`}
            >
              {currentUserInfor
                ? currentUserInfor?.biography || 'Tiểu sử chưa được cập nhật...'
                : adminInfor?.biography}
            </div>
            {role && (
              <div
                onClick={() => setOpenEditUserInformationModal(true)}
                className='mb-5 border border-slate-300 rounded-2xl hover:bg-slate-50 duration-300 ease-in-out text-center py-2 cursor-pointer'
              >
                Chỉnh sửa thông tin
              </div>
            )}
            {/* default profile with list of posts of myself*/}
            <MyOwnPosts />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
