import { BiPencil } from 'react-icons/bi';
import { useCommon } from '../contexts/CommonContext';

function AllPostsOfOtherUser() {
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
    allChosenUserProfilePosts,
    setAllChosenUserProfilePosts,
    chosenUserProfile,
    setChosenUserProfile,
    getAllPostsOfChosenUserProfile,
    getUserInformationOfChosenUserProfile,
    getPostById,
  } = useCommon();

  return (
    <div>
      <div>
        <div
          className={`${
            allChosenUserProfilePosts.length === 0 ? 'mb-0' : 'mb-5'
          }`}
        >
          <div className=''>
            <hr
              className={`${
                allMyPosts.length === 0 ? 'hidden' : 'mt-3 border-slate-300'
              }`}
            />
          </div>
        </div>
      </div>
      {/* List of posts */}
      <div className='list-of-posts-from-chosen-user'>
        {allChosenUserProfilePosts &&
          allChosenUserProfilePosts.map((post, index) =>
            index === 0 ? (
              <div
                onClick={() => handleViewPostDetails(post)}
                key={post?.post_id}
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
                      className='rounded-full w-10 h-10 sm2:w-12 sm2:h-12'
                    />
                  </div>
                  <div className='result-content absolute top-0 left-12 sm2:left-16 w-[80%] sm2:w-[88%]'>
                    <div className='information-and-posttime'>
                      <div className='author-name font-semibold'>
                        {getAuthorNameOfPostByUserId(post?.user_id)}
                      </div>
                      <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                        <BiPencil />
                        <div className=''>
                          {getPostedTime(post?.created_at)}
                        </div>
                      </div>
                      <div className='feeds-content-bottom-description whitespace-nowrap overflow-hidden overflow-ellipsis'>
                        {post.content || '* Bài viết không có tiêu đề'}
                      </div>
                    </div>
                  </div>
                  {index !== allChosenUserProfilePosts.length - 1 ? (
                    <div className='absolute top-[75px] sm2:top-[85px] bg-slate-300 font-thin w-full h-[0.2px]'></div>
                  ) : (
                    <div className='absolute top-[75px] sm2:top-[85px] bg-white w-full h-[0.2px]'></div>
                  )}
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleViewPostDetails(post)}
                key={post?.post_id}
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
                      className='rounded-full w-10 h-10 sm2:w-12 sm2:h-12'
                    />
                  </div>
                  <div className='result-content absolute top-0 left-12 sm2:left-16 w-[80%] sm2:w-[88%]'>
                    <div className='information-and-posttime'>
                      <div className='author-name font-semibold'>
                        {getAuthorNameOfPostByUserId(post?.user_id)}
                      </div>
                      <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                        <BiPencil />
                        <div className=''>
                          {getPostedTime(post?.created_at)}
                        </div>
                      </div>
                      <div className='feeds-content-bottom-description whitespace-nowrap overflow-hidden overflow-ellipsis'>
                        {post?.content || '* Bài viết không có tiêu đề'}
                      </div>
                    </div>
                  </div>
                  {index !== allChosenUserProfilePosts.length - 1 ? (
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

export default AllPostsOfOtherUser;
