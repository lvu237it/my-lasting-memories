import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BiBookmark,
  BiBookmarkMinus,
  BiComment,
  BiCommentAdd,
  BiCommentDetail,
  BiCommentDots,
  BiDotsHorizontalRounded,
  BiEdit,
  BiPencil,
  BiPlusCircle,
  BiTrashAlt,
} from 'react-icons/bi';
import { useCommon } from '../contexts/CommonContext';
import { BiArrowBack } from 'react-icons/bi';
import {
  FaChevronRight,
  FaComment,
  FaCommentAlt,
  FaCommentDollar,
  FaCommentDots,
  FaComments,
} from 'react-icons/fa';
import { AiOutlineComment } from 'react-icons/ai';

function HomePage() {
  const {
    handleOpenPostModal,
    postModal,
    postsList,
    usersList,
    imageUrlsList,
    setImageUrlsList,
    getAllUsers,
    getAllPosts,
    getAuthorNameOfPostByUserId,
    getAuthorAvatarByUserId,
    addPostIconRef,
    logoutIconRef,
    ToastContainer,
    numberCharactersAllowed,
    getPostedTime,
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
    handleSortImagesPath,
    getImageUrlsByPostId,
    lengthOfViewPostImage,
    setLengthOfViewPostImage,
    localUrlImages,
    setLocalUrlImages,
    commentsByPostId,
    setCommentsByPostId,
    getCommentsByPostId,
    getOnwnerInformationByCommentId,
    chosenPost,
    setChosenPost,
  } = useCommon();

  const [viewPostDetails, setViewPostDetails] = useState(false);
  const postDetailsRef = useRef(null);
  const optionsModalRef = useRef(null);
  const contentEditableRef = useRef(null);

  const [isSavedPost, setIsSavedPost] = useState(true); //not yet
  const [openOptionsModal, setOpenOptionsModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelEditingModal, setOpenCancelEditingModal] = useState(false);
  const [contentForUpdate, setContentForUpdate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [contentBeforeUpdate, setContentBeforeUpdate] = useState('');

  const [
    redundantEditingCharactersNumber,
    setRedundantEditingCharactersNumber,
  ] = useState(0);

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

  //Cancel editing post
  //Click "Không" when Modal opened
  const handleConfirmCancelEditingPost = () => {
    setOpenCancelEditingModal(true);
  };

  //Click "Huỷ" when Modal opened
  const handleDefinitelyCancelEditingPost = () => {
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
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Tự động reload sau 2 giây
      toast.success('Xoá bài thành công! Đang trở về trang chủ...');
    } catch (error) {
      console.error('Error deleting post', error);
      setOpenDeleteModal(false);
      toast.error('Xoá bài không thành công. Vui lòng thử lại.');
    }
  };

  const handleRemovePostWarning = () => {
    setOpenOptionsModal(false);
    setOpenDeleteModal(true);
    //disable editing if it opened
    setIsEditing(false);
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

  //Open options modal
  const handleSetOptionsModal = () => {
    setOpenOptionsModal(!openOptionsModal);
  };

  //View post details
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
    getCommentsByPostId(post);
  };

  //Back home from view post details
  const handleBackHome = () => {
    setViewPostDetails(false);
    getAllPosts();
    setLocalUrlImages([]);
    setLengthOfViewPostImage(0);
  };

  //Counting redundant editing characters number
  useEffect(() => {
    const countRedundantCharacter =
      numberCharactersAllowed - contentForUpdate.length; //Số lượng kí tự dư thừa
    setRedundantEditingCharactersNumber(countRedundantCharacter);
  }, [contentForUpdate, redundantEditingCharactersNumber]);

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

  useEffect(() => {
    if (!viewPostDetails) {
      setChosenPost(null);
    }
  }, [viewPostDetails]);

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
    document.addEventListener('mousedown', handleClickOutsideOptionsModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideOptionsModal);
    };
  }, []);

  return (
    <>
      <div className='header-feedscontent my-5'>
        <div className='feeds-content border-slate-300 rounded-3xl shadow shadow-gray-400 px-10 md:px-20 mx-3 md:mx-10 lg:mx-14 py-7 md:py-10'>
          {viewPostDetails ? (
            //View details of a post
            <div className='wrapper-post-details'>
              <button
                onClick={handleBackHome}
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
                      className=' options-modal z-20 absolute w-full translate-y-3/4 sm2:translate-y-0 sm2:top-8 sm2:right-0 sm2:w-[170px] p-3 dropdown-options-post-details rounded-xl bg-white border border-slate-300 shadow shadow-slate-300'
                    >
                      <div className=''>
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
                {/* View information details of post */}
                <div className='details-chosen-post grid grid-cols-12 relative'>
                  <div className='col-span-1'>
                    {/* avatar */}
                    <img
                      src={adminInfor && adminInfor.avatar_path}
                      alt=''
                      className='my-avatar absolute top-0 left-0 w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                    />
                  </div>
                  <div className='col-span-11 flex flex-col'>
                    {/* Author and post time*/}
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
                {/* Editing mode */}
                {isEditing ? (
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
                  // Default content of post details
                  <div id='feeds-content-bottom-description' className='mt-16'>
                    <div className='content-description break-words whitespace-pre-wrap leading-7'>
                      {decodeEntities(contentForUpdate)}
                    </div>
                    {/* Post chỉ có một ảnh duy nhất */}
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
                      <div className='wrapper-of-post-details'>
                        <div
                          ref={scrollContainerRef}
                          onMouseDown={(e) => handleSwipe(e)}
                          onDragStart={(e) => e.preventDefault()}
                          className='wrapper-images-of-post-details vulv-uploaded-images vulv-scrollbar-hide overflow-x-auto mt-4'
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
                                      onClick={(e) =>
                                        handleOpenViewImageModal(e)
                                      }
                                      src={`${apiBaseUrl}${imgurl?.attacheditem_path}`}
                                      alt='attached items'
                                      className='h-[40vh] sm:h-[70vh] w-[150px] sm:w-[450px] object-cover rounded-lg mx-auto'
                                    />
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                        <div className='comments-of-post-details flex gap-2 items-end mt-4'>
                          <AiOutlineComment className='text-3xl cursor-pointer' />
                          <div className='number-of-comments text-lg cursor-pointer'>
                            0
                          </div>
                        </div>
                        <hr className='mt-2' />
                        {commentsByPostId &&
                          commentsByPostId.map((comment, index) => (
                            <div
                              key={index}
                              className='comments-by-post-id details-of-post-comments mt-3 flex gap-3'
                            >
                              <div className='flex-shrink-0'>
                                <img
                                  className='comment-owner w-10 h-10 sm2:w-12 sm2:h-12 my-auto rounded-full bg-cover bg-no-repeat bg-center'
                                  src={
                                    usersList.find(
                                      (user) => user.user_id === comment.user_id
                                    )?.avatar_path
                                  }
                                  // Find avatar of each comment - comment owner - by that comment => user_id => avatar
                                  alt='infor-user-comment'
                                />
                              </div>
                              <div className='flex-1'>
                                <div className='leading-loose break-words whitespace-pre-wrap'>
                                  {
                                    usersList.find(
                                      (user) => user.user_id === comment.user_id
                                    )?.username
                                  }
                                  {/* // Find username of each comment - comment owner - by that comment => user_id => username */}
                                </div>
                                <div className='leading-loose break-words whitespace-pre-wrap'>
                                  {comment?.comment_content}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            //Home page screen with list of posts
            <>
              <div>
                {isUser === false && (
                  <div className='mb-5'>
                    <div className='feeds-content-posts-of-myself flex flex-row justify-between gap-3'>
                      <img
                        src={adminInfor && adminInfor.avatar_path}
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
                    <hr className='mt-3 border-slate-300' />
                  </div>
                )}
              </div>
              <div className=''>
                {/* List of posts */}
                {postsList &&
                  postsList.map((post, index) => (
                    <div
                      onClick={() => handleViewPostDetails(post)}
                      key={post.post_id}
                      className='cursor-pointer text-sm sm2:text-base mb-5'
                    >
                      <div className='feeds-content-posts grid relative mb-[80px]'>
                        <div className='feeds-content-top-about absolute top-0 left-0'>
                          <img
                            src={adminInfor && adminInfor.avatar_path}
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
                      </div>
                      {index !== postsList.length - 1 ? (
                        <hr className=' border-slate-300' />
                      ) : (
                        <hr className=' visible border-white' />
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
