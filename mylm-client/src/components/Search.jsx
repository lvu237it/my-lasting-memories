import {
  BiArrowBack,
  BiBookmark,
  BiBookmarkMinus,
  BiChat,
  BiDotsHorizontalRounded,
  BiEdit,
  BiExit,
  BiSearch,
  BiTrashAlt,
  BiX,
  BiXCircle,
} from 'react-icons/bi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import { FaChevronRight } from 'react-icons/fa';
import { BiPen, BiPencil } from 'react-icons/bi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCommon } from '../contexts/CommonContext';
import debounce from 'lodash.debounce';
import { AiOutlineComment } from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';

function Search() {
  const {
    usersList,
    getAuthorNameOfPostByUserId,
    getAuthorAvatarByUserId,
    getPostedTime,
    addPostIconRef,
    logoutIconRef,
    numberCharactersAllowed,
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
    imageChoseToView,
    setImageChoseToView,
    decodeEntities,
    TextWithLinks,
    apiBaseUrl,
    handleSortImagesPath,
    handleSortImagesCommentPath,
    getImageUrlsByPostId,
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
    getImageUrlsCommentByPostId,
    handleOpenViewImageCommentModal,
    findAttachItemsByCommentIdAfterSorting,
    setCurrentViewImageCommentIndex,
    role,
    setRole,
    currentUserInfor,
    setCurrentUserInfor,
    viewPostDetails,
    setViewPostDetails,
    isScreenLessThan730Px,
    postDetailsRef,
    optionsModalRef,
    commentOptionsModalRef,
    handleSetOptionsModal,
    handleSetCommentOptionsModal,
    handleViewPostDetails,
    searchContent,
    setSearchContent,
  } = useCommon();

  const location = useLocation();
  const navigate = useNavigate();

  const [postsResult, setPostsResult] = useState([]);

  const searchContentRef = useRef();

  const [isSavedPost, setIsSavedPost] = useState(true);

  useEffect(() => {
    if (!viewPostDetails) {
      setChosenPost(null);
    } else {
      getImageUrlsCommentByPostId(chosenPost);
    }
  }, [viewPostDetails, chosenPost]);

  // Handle modals and z-index
  useEffect(() => {
    const updateZIndex = () => {
      const addPostIcon = addPostIconRef.current;
      const logoutIcon = logoutIconRef.current;

      if (addPostIcon) {
        if (
          openOptionsModal ||
          openCommentOptionsModal ||
          openDeleteModal ||
          openCancelEditingModal
        ) {
          addPostIcon.classList.add('hidden');
        } else {
          addPostIcon.classList.remove('hidden');
          addPostIcon.style.zIndex = '1000';
        }
      }

      if (logoutIcon) {
        if (
          openOptionsModal ||
          openCommentOptionsModal ||
          openDeleteModal ||
          openCancelEditingModal
        ) {
          logoutIcon.classList.add('hidden');
        } else {
          logoutIcon.classList.remove('hidden');
          logoutIcon.style.zIndex = '1000';
        }
      }
    };

    updateZIndex();
  }, [
    openOptionsModal,
    openCommentOptionsModal,
    openDeleteModal,
    openCancelEditingModal,
  ]);

  //Back home from view post details
  const handleBackSearch = () => {
    setSearchContent('');
    setViewPostDetails(false);
    setLocalUrlImages([]);
    setLengthOfViewPostImage(0);
    setCommentsByPostId([]);
    setIsEditingComment(false);
    setIsSuccessFullyRemoved(false);
    setImagesComment([]);
    setLocalUrlImagesComment([]);
    setChosenPost(null);
    setCurrentViewImageCommentIndex(null);
  };

  const handleClearSearchContent = () => {
    setSearchContent('');
    searchContentRef.current.value = '';
  };

  const handleSearchPostsByContent = async () => {
    if (searchContent.trim().length > 0) {
      try {
        const response = await axios.post(`${apiBaseUrl}/posts/bycontent`, {
          content: searchContent,
        });
        setPostsResult(response.data);
      } catch (error) {
        console.log('Error finding post', error);
        setPostsResult([]);
      }
    } else {
      setPostsResult([]);
    }
  };

  // Sử dụng debounce cho hàm handleSearchPostsByContent
  const debouncedSearchResults = useCallback(
    debounce(handleSearchPostsByContent, 500), //thay đổi milliseconds nếu muốn giới hạn thêm thời gian tìm kiếm
    [searchContent] // Thêm searchContent vào dependency array để debounce cập nhật khi searchContent thay đổi
  );

  useEffect(() => {
    debouncedSearchResults();

    // Hủy bỏ debounce khi component unmount
    return () => {
      debouncedSearchResults.cancel();
    };
  }, [searchContent, debouncedSearchResults]);

  useEffect(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      if (postsResult.length > 0) {
        searchInput.classList.add('mb-6');
      } else {
        searchInput.classList.remove('mb-6');
      }
    }
  }, [searchContentRef.current, postsResult.length]);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn');
      } else {
        entry.target.classList.remove('animate-fadeIn');
        entry.target.classList.add('z-0');
      }
    });
  });

  useEffect(() => {
    const sectionPostedItems = document.querySelectorAll('.result-item');
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

  return (
    <>
      <div className='wrapper my-3 relative'>
        <div className=' md:border-slate-300 md:rounded-3xl md:shadow md:shadow-gray-400 sm2:px-10 sm2:py-5 md:px-20 md:mx-10 lg:mx-14 md:py-10 mx-3 my-5'>
          <>
            <div
              id='search-input'
              className='tracking-wide rounded-2xl leading-8 border border-slate-300'
            >
              <div className='relative flex gap-2 px-4 py-2 rounded-2xl bg-slate-50'>
                <div className='my-auto text-2xl'>
                  <BiSearch />
                </div>
                <input
                  onChange={(e) => setSearchContent(e.target.value)}
                  ref={searchContentRef}
                  autoFocus
                  className='bg-slate-50 w-[75%] sm:w-[80%] sm2:[85%] md:w-[90%]'
                  type='text'
                  placeholder='Tìm kiếm bài viết'
                />
                {searchContent && (
                  <BiXCircle
                    onClick={handleClearSearchContent}
                    className='absolute top-[14px] right-4 text-xl cursor-pointer'
                  />
                )}
              </div>
            </div>
            <div className='grid-search-results'>
              {searchContent && (
                <div className='mb-[50px]'>
                  {postsResult.map((post, index) => (
                    <div
                      onClick={() => handleViewPostDetails(post)}
                      key={index}
                      className='result-item grid relative mb-4 cursor-pointer'
                    >
                      <div className=''>
                        <div className='image-avatar absolute top-0 left-0'>
                          <img
                            src={
                              getAuthorAvatarByUserId(post.user_id) ||
                              './user-avatar-default.png'
                            }
                            alt=''
                            className='rounded-full w-12 h-12'
                          />
                        </div>
                        <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                          <div className='name-and-posted-at'>
                            <div className='font-semibold'>
                              {getAuthorNameOfPostByUserId(post.user_id)}
                            </div>
                            <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                              <BiPencil />
                              <div className=''>
                                {getPostedTime(post.created_at)}
                              </div>
                            </div>
                            <div className='result-little-detail whitespace-nowrap overflow-hidden overflow-ellipsis'>
                              {post.content}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index !== postsResult.length - 1 && (
                        <hr className='mt-[87px] border-slate-300' />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {searchContent && postsResult.length === 0 && (
              <div className='text-center text-lg'>Không có kết quả</div>
            )}
          </>
        </div>
      </div>
    </>
  );
}

export default Search;
