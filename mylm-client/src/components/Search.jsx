import {
  BiArrowBack,
  BiBookmark,
  BiBookmarkMinus,
  BiDotsHorizontalRounded,
  BiEdit,
  BiExit,
  BiSearch,
  BiTrashAlt,
  BiX,
  BiXCircle,
} from 'react-icons/bi';
import { useState, useEffect, useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { BiPen, BiPencil } from 'react-icons/bi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCommon } from '../contexts/CommonContext';

function Search() {
  const {
    getAuthorNameOfPostByUserId,
    getPostedTime,
    addPostIconRef,
    logoutIconRef,
    numberCharactersAllowed,
    scrollContainerRef,
    handleSwipe,
    isUser,
    setIsUser,
    adminInfor,
    openViewImageModal,
    setOpenViewImageModal,
    handleOpenViewImageModal,
    imageChoseToView,
    setImageChoseToView,
    decodeEntities,
    apiBaseUrl,
  } = useCommon();

  const [searchContent, setSearchContent] = useState('');
  const [postsResult, setPostsResult] = useState([]);

  const searchContentRef = useRef();

  const [viewPostDetails, setViewPostDetails] = useState(false);
  const postDetailsRef = useRef(null);
  const optionsModalRef = useRef(null);
  const contentEditableRef = useRef(null);

  const [chosenPost, setChosenPost] = useState(null);
  const [isSavedPost, setIsSavedPost] = useState(true);
  const [openOptionsModal, setOpenOptionsModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelEditingModal, setOpenCancelEditingModal] = useState(false);
  const [contentForUpdate, setContentForUpdate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [contentBeforeUpdate, setContentBeforeUpdate] = useState('');
  const [localUrlImages, setLocalUrlImages] = useState([]);

  const [
    redundantEditingCharactersNumber,
    setRedundantEditingCharactersNumber,
  ] = useState(0);

  //Cancel editing post
  //Click "Không" when Modal opened
  const handleConfirmCancelEditingPost = () => {
    setOpenCancelEditingModal(true);
  };

  //Click "Huỷ" when Modal opened
  const handleDefinitelyCancelEditingPost = () => {
    console.log('contentBeforeUpdate', contentBeforeUpdate);
    if (contentForUpdate !== contentBeforeUpdate) {
      //Có sự thay đổi content so với ban đầu nhưng Huỷ - không tiếp tục chỉnh sửa
      //=> Giữ content ban đầu
      setContentForUpdate(contentBeforeUpdate);
    }
    setOpenCancelEditingModal(false);
    setIsEditing(false);
  };

  //Editing post
  const handleEditingPost = async () => {
    if (contentForUpdate.length > 1000) {
      toast.error(
        'Chỉnh sửa không thành công. Nội dung bài đăng không được vượt quá 1000 kí tự.'
      );
    } else {
      try {
        await axios.patch(`${apiBaseUrl}/posts/update/${chosenPost.post_id}`, {
          content: contentForUpdate,
        });
        setIsEditing(false);
        // Cập nhật contentBeforeUpdate khi cập nhật thành công
        //ContentBeforeUpdate lúc này sẽ giữ trạng thái ban đầu của content khi chưa thay đổi
        setContentBeforeUpdate(contentForUpdate);
        toast.success('Chỉnh sửa bài thành công!');
      } catch (error) {
        console.error('Error editing post', error);
        setIsEditing(false);
        toast.error('Chỉnh sửa bài không thành công. Vui lòng thử lại.');
      }
    }
  };

  const handleOpenEditingPost = () => {
    setIsEditing(true);
    setOpenOptionsModal(false);
  };

  //Click ra ngoài phạm vi của phần tử editing
  const handleInputBlur = () => {
    // setIsEditing(false);
    setContentForUpdate(contentEditableRef.current.innerText);
  };

  //Deleting post
  const handleFinallyRemovePost = async () => {
    try {
      await axios.patch(`${apiBaseUrl}/posts/delete/${chosenPost.post_id}`);
      // setPostModal(false);
      // textareaRef.current.value = '';
      // setHasPostContent(false);
      setOpenDeleteModal(false);
      toast.success('Xoá bài thành công! Đang trở về trang chủ...');
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Tự động reload sau 3 giây
    } catch (error) {
      console.error('Error deleting post', error);
      setOpenDeleteModal(false);
      toast.error('Xoá bài không thành công. Vui lòng thử lại.');
    }
  };

  const handleViewPostDetails = (post) => {
    setChosenPost(post);
    //Lấy images url
    getImageUrlsByPostId(post);
    //Lưu dữ liệu (content) gốc vào 1 biến khác để so sánh khi cập nhật/huỷ cập nhật
    setContentBeforeUpdate(post.content);
    //Hiển thị content của selected post (to view details) lần đầu tiên,
    //sau đó mặc định đặt giá trị content đó cho updated content
    //Để phục vụ cho việc update content
    setContentForUpdate(post.content); // Cập nhật contentForUpdate khi chọn post
    setViewPostDetails(true);
  };

  const getImageUrlsByPostId = async (post) => {
    try {
      const urlImageListLocal = await axios.get(
        `${apiBaseUrl}/posts/${post.post_id}/images`
      );
      setLocalUrlImages(urlImageListLocal.data);
    } catch (error) {
      console.error('Error finding images url by post id', error);
    }
  };

  useEffect(() => {
    if (!viewPostDetails) {
      setChosenPost(null);
    }
  }, [viewPostDetails]);

  useEffect(() => {
    console.log('localUrlImages.length', localUrlImages.length);
    console.log('localUrlImages', localUrlImages);
  }, [localUrlImages]);

  //Open options modal
  const handleSetOptionsModal = () => {
    setOpenOptionsModal(!openOptionsModal);
  };

  //Click outside of options modal
  const handleClickOutsideOptionsModal = (event) => {
    if (
      optionsModalRef.current &&
      !optionsModalRef.current.contains(event.target)
    ) {
      setOpenOptionsModal(false);
    }
  };

  const handleRemovePostWarning = () => {
    setOpenOptionsModal(false);
    setOpenDeleteModal(true);
    //disable editing if it opened
    setIsEditing(false);
  };

  // Handle modals and z-index
  useEffect(() => {
    const updateZIndex = () => {
      const addPostIcon = addPostIconRef.current;
      const logoutIcon = logoutIconRef.current;

      if (addPostIcon) {
        if (openOptionsModal || openDeleteModal || openCancelEditingModal) {
          addPostIcon.classList.add('hidden');
        } else {
          addPostIcon.classList.remove('hidden');
          addPostIcon.style.zIndex = '1000';
        }
      }

      if (logoutIcon) {
        if (openOptionsModal || openDeleteModal || openCancelEditingModal) {
          logoutIcon.classList.add('hidden');
        } else {
          logoutIcon.classList.remove('hidden');
          logoutIcon.style.zIndex = '1000';
        }
      }
    };

    updateZIndex();
  }, [openOptionsModal, openDeleteModal, openCancelEditingModal]);

  useEffect(() => {
    if (isEditing && contentEditableRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentEditableRef.current);
      range.collapse(false); // Đặt con trỏ ở cuối nội dung
      selection.removeAllRanges();
      selection.addRange(range);
      contentEditableRef.current.focus();
    }
  }, [isEditing]);

  //Counting redundant editing characters number
  useEffect(() => {
    const countRedundantCharacter =
      numberCharactersAllowed - contentForUpdate.length; //Số lượng kí tự dư thừa
    setRedundantEditingCharactersNumber(countRedundantCharacter);
  }, [contentForUpdate, redundantEditingCharactersNumber]);

  //Back home from view post details
  const handleBackSearch = () => {
    setSearchContent('');
    setViewPostDetails(false);
    setLocalUrlImages([]);
  };

  const handleClearSearchContent = () => {
    setSearchContent('');
    searchContentRef.current.value = '';
  };

  useEffect(() => {
    const handleSearchPostsByContent = async () => {
      if (searchContent.trim().length > 0) {
        try {
          const response = await axios.post(`${apiBaseUrl}/posts/bycontent`, {
            content: searchContent,
          });
          setPostsResult(response.data);
        } catch (error) {
          console.error('Error finding post', error);
          setPostsResult([]);
        }
      } else {
        setPostsResult([]);
      }
    };
    handleSearchPostsByContent();
  }, [searchContent]);

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
    document.addEventListener('mousedown', handleClickOutsideOptionsModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideOptionsModal);
    };
  }, []);
  return (
    <>
      <div className='wrapper my-3 relative'>
        <div className=' md:border-slate-300 md:rounded-3xl md:shadow md:shadow-gray-400 sm2:px-10 sm2:py-5 md:px-20 md:mx-10 lg:mx-14 md:py-10 mx-3 my-5'>
          {viewPostDetails ? (
            <>
              <div className='wrapper-post-details'>
                <button
                  onClick={handleBackSearch}
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
                        className=' options-modal z-20 absolute w-[80%] left-1/2 sm2:left-auto -translate-x-1/2 sm2:-translate-x-0 translate-y-3/4 sm2:translate-y-0 sm2:top-8 sm2:right-0 sm2:w-[170px] p-3 dropdown-options-post-details rounded-xl bg-white border border-slate-300 shadow shadow-slate-300'
                      >
                        <div className=' '>
                          <div
                            id='saved-unsaved-post'
                            className='cursor-pointer px-3 py-2 hover:bg-slate-100 hover:rounded-lg'
                          >
                            {isSavedPost ? (
                              <div className=' grid grid-cols-12'>
                                <div className='col-span-11'>Lưu bài viết</div>
                                <BiBookmark className='col-span-1 my-auto' />
                              </div>
                            ) : (
                              <div className='grid grid-cols-12 '>
                                <div className='col-span-11'>Bỏ lưu</div>
                                <BiBookmarkMinus className='col-span-1 my-auto' />
                              </div>
                            )}
                          </div>
                          <div
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
                                  id='cancel-final-delete'
                                  onClick={() => setOpenDeleteModal(false)}
                                  className='col-span-1 cursor-pointer p-2'
                                >
                                  Huỷ
                                </div>
                                <div
                                  onClick={handleFinallyRemovePost}
                                  id='finally-delete'
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
                  <div className='details-chosen-post grid grid-cols-12 relative'>
                    <div className='col-span-1'>
                      <img
                        src={adminInfor && adminInfor.avatar_path}
                        alt=''
                        className='my-avatar absolute top-0 left-0 w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                      />
                    </div>
                    <div className='col-span-11 flex flex-col'>
                      <div className='flex justify-between'>
                        <div className='name-and-postedat absolute top-0 left-12 sm2:left-16'>
                          <div className='font-semibold'>
                            {getAuthorNameOfPostByUserId(chosenPost.user_id)}
                          </div>
                          <div className='flex flex-row gap-1 items-center text-slate-700 opacity-70'>
                            <BiPencil />
                            <div className=''>
                              {getPostedTime(chosenPost.created_at)}
                            </div>
                          </div>
                        </div>
                        {isUser === true ? (
                          ''
                        ) : (
                          <div
                            onClick={handleSetOptionsModal}
                            className='absolute top-0 right-0 duration-300 ease-in-out text-xl sm2:text-2xl cursor-pointer rounded-full p-1 hover:bg-slate-100'
                          >
                            <BiDotsHorizontalRounded />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing ? (
                    //Edit mode
                    <div className='wrapper-editing mt-16 relative'>
                      <div className='redundant-editing-characters-number absolute -top-11 right-2 text-red-600 tracking-wide'>
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
                            <div
                              id='cancel-deleting-modal'
                              className='relative z-20'
                            >
                              <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                                <div className='font-semibold text-center mb-4'>
                                  Huỷ bỏ thay đổi?
                                </div>
                                <hr className='' />
                                <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                                  <div
                                    id='continue-edit'
                                    onClick={() =>
                                      setOpenCancelEditingModal(false)
                                    }
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
                    //Default mode
                    // Default content of post details
                    <div
                      id='feeds-content-bottom-description-search'
                      className='break-words mt-16'
                    >
                      <div className='content-description break-words whitespace-pre-wrap leading-7'>
                        {decodeEntities(contentForUpdate)}
                      </div>
                      {localUrlImages.length === 1 ? (
                        <div className='content-attachments w-[95%] mt-4 cursor-pointer'>
                          <img
                            onClick={(e) => handleOpenViewImageModal(e)}
                            src={`${apiBaseUrl}${localUrlImages[0]?.attacheditem_path}`}
                            alt='attached items'
                            className='rounded-lg mx-auto'
                          />
                        </div>
                      ) : (
                        <div
                          className='vulv-scrollbar-hide flex flex-col justify-center items-center gap-3 overflow-x-auto mt-4'
                          ref={scrollContainerRef}
                          onMouseDown={handleSwipe}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          {localUrlImages.length > 1 &&
                            localUrlImages.map((imgurl, index) => (
                              <div
                                key={index}
                                className='content-attachments w-[95%] cursor-pointer'
                              >
                                <img
                                  onClick={(e) => handleOpenViewImageModal(e)}
                                  src={`${apiBaseUrl}${imgurl?.attacheditem_path}`}
                                  alt='attached items'
                                  className='rounded-lg mx-auto'
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
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
                              src={adminInfor && adminInfor.avatar_path}
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
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
