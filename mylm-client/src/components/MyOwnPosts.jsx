import { BiPencil, BiPlusCircle } from 'react-icons/bi';
import { useCommon } from '../contexts/CommonContext';
import { useEffect } from 'react';
import axios from 'axios';

function MyOwnPosts() {
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

  const fetchNewUserInformation = async () => {
    const currentLoggedIn =
      JSON.parse(localStorage.getItem('admin')) ||
      JSON.parse(localStorage.getItem('user')) ||
      JSON.parse(localStorage.getItem('exceptional'));

    if (currentLoggedIn) {
      try {
        // Lấy thông tin người dùng hiện tại
        const constCurrentLoggedInNewInfor = await axios.get(
          `${apiBaseUrl}/users/current-logged-in-information?role=${currentUserInfor.role}&userid=${currentUserInfor.user_id}`
        );
        console.log('first', constCurrentLoggedInNewInfor);
        setCurrentUserInfor(constCurrentLoggedInNewInfor.data[0]);
      } catch (err) {
        console.log('Error when getting data', err);
      }
    }
  };

  return (
    <div>
      <div>
        {role && (
          <div className={`${allMyPosts.length === 0 ? 'mb-0' : 'mb-5'}`}>
            <div className=''>
              <div className='feeds-content-posts-of-myself flex flex-row justify-between gap-3 my-5'>
                <img
                  src={
                    currentUserInfor
                      ? currentUserInfor?.avatar_path ||
                        './user-avatar-default.png'
                      : adminInfor?.avatar_path
                  } //Thông tin của người đăng nhập hiện tại
                  alt=''
                  className='my-avatar basis-1/7 w-10 h-10 sm2:w-[50px] sm2:h-[50px] my-auto rounded-full object-cover bg-no-repeat bg-center'
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
                  allMyPosts.length === 0 ? 'hidden' : 'mt-3 border-slate-300'
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
                      src={
                        getAuthorAvatarByUserId(post.user_id).includes(
                          'https://res.cloudinary.com'
                        )
                          ? 'https://res.cloudinary.com' +
                            getAuthorAvatarByUserId(post.user_id).split(
                              'https://res.cloudinary.com'
                            )[1]
                          : getAuthorAvatarByUserId(post.user_id) ||
                            './user-avatar-default.png'
                      }
                      alt=''
                      className='rounded-full object-cover w-10 h-10 sm2:w-12 sm2:h-12'
                    />
                  </div>
                  <div className='result-content absolute top-0 left-12 sm2:left-16 w-[80%] sm2:w-[88%]'>
                    <div className='information-and-posttime'>
                      <div className='author-name font-semibold'>
                        {getAuthorNameOfPostByUserId(post.user_id)}
                      </div>
                      <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                        <BiPencil />
                        <div className=''>{getPostedTime(post.created_at)}</div>
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
                      src={
                        getAuthorAvatarByUserId(post.user_id).includes(
                          'https://res.cloudinary.com'
                        )
                          ? 'https://res.cloudinary.com' +
                            getAuthorAvatarByUserId(post.user_id).split(
                              'https://res.cloudinary.com'
                            )[1]
                          : getAuthorAvatarByUserId(post.user_id) ||
                            './user-avatar-default.png'
                      }
                      alt=''
                      className='rounded-full object-cover w-10 h-10 sm2:w-12 sm2:h-12'
                    />
                  </div>
                  <div className='result-content absolute top-0 left-12 sm2:left-16 w-[80%] sm2:w-[88%]'>
                    <div className='information-and-posttime'>
                      <div className='author-name font-semibold'>
                        {getAuthorNameOfPostByUserId(post.user_id)}
                      </div>
                      <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                        <BiPencil />
                        <div className=''>{getPostedTime(post.created_at)}</div>
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
  );
}

export default MyOwnPosts;
