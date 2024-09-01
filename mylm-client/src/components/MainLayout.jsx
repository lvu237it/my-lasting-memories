import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BiHome,
  BiSearch,
  BiBell,
  BiSolidPlaylist,
  BiBookmark,
  BiMessage,
  BiMenu,
  BiPencil,
  BiImageAdd,
  BiUser,
  BiLogOut,
  BiLogIn,
  BiX,
  BiPlusCircle,
} from 'react-icons/bi';
import { AiFillBell, AiFillHome, AiOutlineLogin } from 'react-icons/ai';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import NavBar from './NavBar';

import { useCommon } from '../contexts/CommonContext';
import { toast } from 'react-toastify';

const MainLayout = () => {
  const {
    showNavbarSlider,
    setShowNavbarSlider,
    navbarIconRef,
    navbarSliderRef,
    headerIconsClicked,
    setHeaderIconsClicked,
    showIcon,
    setShowIcon,
    handleClickHeaderIcons,
    handleClickNavbarIcon,
    handleOpenPostModal,
    handleClosePostModal,
    handleClickPostNew,
    handleClickOutsideNavBar,
    handleClickAddImageIcon,
    handleClickAddAvatarImageIcon,
    handleClickAddCommentImageIcon,
    handleFileChange,
    handleFileOfCommentChange,
    images,
    setImages,
    imagesComment,
    setImagesComment,
    imageUrlsList,
    setImageUrlsList,
    handleSwipePostImage,
    handleSwipePostCommonImage,
    handleSwipeCommentImage,
    postModal,
    setPostModal,
    postContent,
    setPostContent,
    commentContent,
    setCommentContent,
    hasPostContent,
    setHasPostContent,
    showdiscardModal,
    setShowDiscardModal,
    clickCancelDiscard,
    setClickCancelDiscard,
    discard,
    setDiscard,
    textareaRef,
    postItemsUploadRef,
    scrollContainerPostRef,
    scrollContainerPostCommonRef,
    scrollContainerCommentImageRef,
    handleCreatePost,
    ToastContainer,
    addPostIconRef,
    logoutIconRef,
    redundantCharactersNumber,
    setRedundantCharactersNumber,
    redundantCommentCharactersNumber,
    setRedundantCommentCharactersNumber,
    numberCharactersAllowed,
    adminInfor,
    setAdminInfor,
    openViewImageModal,
    openViewImageCommentModal,
    setOpenViewImageCommentModal,
    setOpenViewImageModal,
    handleOpenViewImageModal,
    imageChoseToViewRef,
    handleClickOutsideImageViewModal,
    handleClickOutsideImageViewCommentModal,
    imageChoseToView,
    setImageChoseToView,
    cancelViewPostImageRef,
    cancelViewCommentImageRef,
    localUrlImages,
    setLocalUrlImages,
    lengthOfViewPostImage,
    setLengthOfViewPostImage,
    viewPrevImageRef,
    viewNextImageRef,
    handleViewPrevImage,
    handleViewNextImage,
    openAddCommentModal,
    setOpenAddCommentModal,
    handleClosePostCommentModal,
    showdiscardCommentModal,
    setShowDiscardCommentModal,
    clickCancelCommentDiscard,
    setClickCancelCommentDiscard,
    hasPostCommentContent,
    setHasPostCommentContent,
    discardComment,
    setDiscardComment,
    textareaCommentRef,
    handleClickPostNewComment,
    handleCreateComment,
    chosenPost,
    setChosenPost,
    openOptionsModal,
    setOpenOptionsModal,
    openCommentOptionsModal,
    setOpenCommentOptionsModal,
    openDeleteModal,
    setOpenDeleteModal,
    openCancelEditingModal,
    setOpenCancelEditingModal,
    handleRemovePostWarning,
    handleFinallyRemoveComment,
    isEditing,
    setIsEditing,
    openDeleteCommentModal,
    setOpenDeleteCommentModal,
    isEditingComment,
    setIsEditingComment,
    selectedCommentRemoveEdit,
    setSelectedCommentRemoveEdit,
    handleOpenEditingPost,
    localUrlImagesComment,
    setLocalUrlImagesComment,
    lengthOfViewPostImageComment,
    setLengthOfViewPostImageComment,
    imageChoseToViewComment,
    setImageChoseToViewComment,
    imageChoseToViewCommentRef,
    viewPrevCommentImageRef,
    viewNextCommentImageRef,
    handleViewPrevCommentImage,
    handleViewNextCommentImage,
    commentsByPostId,
    setCommentsByPostId,
    role,
    setRole,
    currentUserInfor,
    setCurrentUserInfor,
    apiBaseUrl,
    getAllUsers,
    getAllPostsOfAdmin,
    getAllPostsExceptMe,
    postsList,
    setPostsList,
    getAllMyPosts,
    allMyPosts,
    setAllMyPosts,
    setCurrentViewImageIndex,
    sortedUrlImages,
    imagesOfCurrentCommentDragging,
    currentViewImage,
    setMappedImagesOfCurrentCommentDragging,
    currentViewImageComment,
    mappedImagesOfCurrentCommentDragging,
    sortedUrlImagesComment,
    redundantEditingCommentCharactersNumber,
    contentEditableRef,
    isSuccessFullyRemoved,
    setCommentForUpdate,
    setCurrentViewImageCommentIndex,
    redundantEditingCharactersNumber,
    commentEditableRef,
    setRedundantEditingCharactersNumber,
    contentForUpdate,
    commentForUpdate,
    getCommentsByPostId,
    setRedundantEditingCommentCharactersNumber,
    viewPostDetails,
    setViewPostDetails,
    commentOptionsModalRef,
    optionsModalRef,
    openEditUserInformationModal,
    setOpenEditUserInformationModal,
    currentLoggedIn,
    getCurrentLoggedInUser,
    openChangePostStatusModal,
    setOpenChangePostStatusModal,
    allChosenUserProfilePosts,
    setAllChosenUserProfilePosts,
    chosenUserProfile,
    setChosenUserProfile,
    getAllPostsOfChosenUserProfile,
    getUserInformationOfChosenUserProfile,
    getPostById,
    searchContent,
    setSearchContent,
    postsResult,
    setPostsResult,
    handleFileAvatarImageChange,
    previewImageAvatar,
    setPreViewImageAvater,
    imageAvatar,
    setImageAvatar,
    openOptionsAvatarImageModal,
    setOpenOptionsAvatarImageModal,
    uploadAvatarImageToCloudinary,
    openViewAvatarImage,
    setOpenViewAvatarImage,
    myImageAvatarRef,
    imageAvatarChosenUserProfileRef,
  } = useCommon();

  const navigate = useNavigate();
  const location = useLocation();

  const editUserInformationModalRef = useRef(null);
  const closeEditUserInformationModelRef = useRef(null);
  const biographyEditableRef = useRef(null);
  const usernameEditableRef = useRef(null);
  const nicknameEditableRef = useRef(null);
  const optionsAvatarImageModalRef = useRef(null);
  const imageAvatarViewingRef = useRef(null);
  const imageAvatarChosenRef = useRef(null);

  const [usernameForUpdate, setUsernameForUpdate] = useState('');
  const [usernameBeforeUpdate, setUsernameBeforeUpdate] = useState('');
  const [nicknameForUpdate, setNicknameForUpdate] = useState('');
  const [nicknameBeforeUpdate, setNicknameBeforeUpdate] = useState('');
  const [biographyForUpdate, setBiographyForUpdate] = useState('');
  const [biographyBeforeUpdate, setBiographyBeforeUpdate] = useState('');

  const [openConfirmLogout, setOpenConfirmLogout] = useState(false);

  const [
    openWarningCancelEditingUserInformation,
    setOpenWarningCancelEditingUserInformation,
  ] = useState(false);

  const handleFinallyLogout = () => {
    setPostsList([]);
    setCurrentUserInfor(null);
    setAllMyPosts([]);
    setCommentsByPostId([]);
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
    localStorage.removeItem('exceptional');
    navigate('/login');
  };

  const handleClickOutsideOptionAvatarImageModal = (e) => {
    if (
      optionsAvatarImageModalRef.current &&
      !optionsAvatarImageModalRef.current.contains(e.target)
    ) {
      setOpenOptionsAvatarImageModal(false);
    }
  };

  //Lấy thông tin admin để hiển thị mặc định ở trang home - trang chính thức
  useEffect(() => {
    const getAdminInformation = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/admin/information`);
        setAdminInfor(response.data[0]);
      } catch (err) {
        console.log('Error when getting admin information', err);
      }
    };

    getAdminInformation();
    console.log('apiBaseUrl', apiBaseUrl);
  }, []);

  const fetchData = async () => {
    if (currentLoggedIn) {
      try {
        // Lấy thông tin người dùng hiện tại
        const userResponse = await axios.get(
          `${apiBaseUrl}/users/current-logged-in-information?role=${currentLoggedIn.role}&userid=${currentLoggedIn.user_id}`
        );
        setCurrentUserInfor(userResponse.data[0]);
      } catch (err) {
        console.log('Error when getting data', err);
      }

      if (currentLoggedIn.role === 'admin' || currentLoggedIn.role === 'user') {
        try {
          // Lấy các bài viết ngoại trừ của người dùng hiện tại
          const postsResponse = await axios.get(
            `${apiBaseUrl}/posts/except-me/${currentLoggedIn.user_id}`
          );
          setPostsList(postsResponse.data);
        } catch (err) {
          console.log('Error when getting data', err);
        }
      } else {
        try {
          // Lấy các bài viết ngoại trừ của người dùng hiện tại
          const postsResponse = await axios.get(
            `${apiBaseUrl}/posts/get-except-me-and-admin/${currentLoggedIn.user_id}`
          );
          setPostsList(postsResponse.data);
        } catch (err) {
          console.log('Error when getting data', err);
        }
      }

      try {
        const currentInfor =
          JSON.parse(localStorage.getItem('admin')) ||
          JSON.parse(localStorage.getItem('user')) ||
          JSON.parse(localStorage.getItem('exceptional'));
        const response = await axios.get(
          `${apiBaseUrl}/posts/my-all-posts/${currentInfor.user_id}`
        );
        setAllMyPosts(response.data);
      } catch (error) {
        console.error('Error getting my all posts', error);
      }
    } else {
      try {
        // Lấy tất cả các bài viết của admin nếu không có ai đăng nhập
        const postsResponse = await axios.get(`${apiBaseUrl}/posts/admin`);
        setPostsList(postsResponse.data);
      } catch (err) {
        console.log('Error when getting admin posts', err);
      }
    }
  };

  const handleChangeNewImage = (event) => {
    setOpenOptionsAvatarImageModal(!openOptionsAvatarImageModal);
  };

  const handleRemoveCurrentAvatarImageIcon = () => {
    setImageAvatar(null);
    setPreViewImageAvater(['./user-avatar-default.png']);
    setOpenOptionsAvatarImageModal(false);
    // imageAvatarChosenRef.current.src = './user-avatar-default.png';
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname !== '/search') {
      setSearchContent('');
      setPostsResult([]);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    //Set user information before
    setUsernameBeforeUpdate(currentUserInfor?.username);
    setNicknameBeforeUpdate(currentUserInfor?.nickname || '');
    setBiographyBeforeUpdate(currentUserInfor?.biography || '');
  }, []);

  useEffect(() => {
    //Set user information before
    setUsernameBeforeUpdate(usernameForUpdate);
    setNicknameBeforeUpdate(nicknameForUpdate || '');
    setBiographyBeforeUpdate(biographyForUpdate || '');
  }, [usernameForUpdate, nicknameForUpdate, biographyForUpdate]);

  useEffect(() => {
    getAllUsers();

    const admin = JSON.parse(localStorage.getItem('admin'));
    const user = JSON.parse(localStorage.getItem('user'));
    const exceptional = JSON.parse(localStorage.getItem('exceptional'));
    if (admin) {
      localStorage.removeItem('user');
      localStorage.removeItem('exceptional');
      setRole('admin');
      // navigate('/');
    } else if (user) {
      localStorage.removeItem('admin');
      localStorage.removeItem('exceptional');
      setRole('user');
    } else if (exceptional) {
      localStorage.removeItem('admin');
      localStorage.removeItem('user');
      setRole('exceptional');
    } else {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    setLengthOfViewPostImage(localUrlImages.length);
  }, [localUrlImages, location.pathname]);

  useEffect(() => {
    const iconClicked = document.getElementById(headerIconsClicked);
    const allHeaderIcons = Array.from(
      document.querySelectorAll('.left-sidebar-icons')
    );
    let showingIcons = [...showIcon];
    if (!iconClicked) {
      setHeaderIconsClicked('header-icon-bi-home');

      showingIcons.shift();
      setShowIcon(showingIcons);

      return;
    } else {
      let unclickedHeaderIcons = allHeaderIcons.filter(
        (icon) => icon.id !== iconClicked.id
      );

      unclickedHeaderIcons.forEach((e) => {
        e.classList.remove(
          'bg-gray-100',
          'shadow',
          'shadow-slate-200',
          'scale-110'
        );
        e.classList.add(
          'hover:bg-gray-100',
          'hover:shadow',
          'hover:shadow-slate-200',
          'scale-90'
        );
      });

      iconClicked.classList.remove(
        'hover:bg-gray-100',
        'hover:shadow',
        'hover:shadow-slate-200',
        'scale-90'
      );
      iconClicked.classList.add(
        'bg-gray-100',
        'shadow',
        'shadow-slate-200',
        'scale-110'
      );
    }
  }, [headerIconsClicked, showIcon]);

  useEffect(() => {
    if (headerIconsClicked === 'header-icon-bi-home') {
      navigate('/');
      setChosenUserProfile(null);
    } else if (headerIconsClicked === 'header-icon-bi-search') {
      navigate('/search');
      setChosenUserProfile(null);
    } else if (headerIconsClicked === 'header-icon-bi-bell') {
      navigate('/notifications');
      setChosenUserProfile(null);
    } else if (headerIconsClicked === 'header-icon-bi-playlist') {
      navigate('/myplaylists');
      setChosenUserProfile(null);
    } else if (headerIconsClicked === 'header-icon-bi-bookmark') {
      navigate('/savedposts');
      setChosenUserProfile(null);
    } else if (headerIconsClicked === 'header-icon-bi-message') {
      navigate('/messages');
      setChosenUserProfile(null);
    } else if (
      headerIconsClicked === 'header-icon-profile' &&
      !chosenUserProfile
    ) {
      navigate('/profile');
    } else if (
      headerIconsClicked === 'header-icon-profile' &&
      chosenUserProfile
    ) {
      navigate(`/profile/${chosenUserProfile.user_id}`);
    }
  }, [headerIconsClicked]);

  useEffect(() => {
    if (chosenUserProfile) {
      if (chosenUserProfile.user_id === currentUserInfor.user_id) {
        setChosenUserProfile(null);
        setAllChosenUserProfilePosts([]);
        navigate('/profile');
      } else if (chosenUserProfile.user_id !== currentUserInfor.user_id) {
        navigate(`/profile/${chosenUserProfile.user_id}`);
      }
    }
  }, [chosenUserProfile]);

  useEffect(() => {
    if (location.pathname.includes('/profile')) {
      setHeaderIconsClicked('header-icon-profile');
    }
    // if (location.pathname === '/post-details') {
    //   setChosenUserProfile(null);
    // }
  }, [location.pathname]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideNavBar);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNavBar);
    };
  }, []);

  useEffect(() => {
    document.addEventListener(
      'mousedown',
      handleClickOutsideOptionAvatarImageModal
    );
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideOptionAvatarImageModal
      );
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideImageViewModal);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideImageViewModal
      );
    };
  }, []);

  useEffect(() => {
    document.addEventListener(
      'mousedown',
      handleClickOutsideImageViewCommentModal
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideImageViewCommentModal
      );
    };
  }, []);

  //Discard post modal
  useEffect(() => {
    if (discard) {
      textareaRef.current.value = '';
      setImageUrlsList([]);
      setImages([]);
      setDiscard(false);
      setPostModal(false);
      setShowDiscardModal(false);
      setHasPostContent(false);
      setPostContent('');
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

  //Discard post comment modal
  useEffect(() => {
    if (discardComment) {
      textareaCommentRef.current.value = '';
      setImageUrlsList([]);
      setImagesComment([]);
      setDiscardComment(false);
      setOpenAddCommentModal(false);
      setShowDiscardCommentModal(false);
      setHasPostCommentContent(false);
      setCommentContent('');
    }
  }, [discardComment]);

  useEffect(() => {
    if (clickCancelCommentDiscard) {
      setClickCancelCommentDiscard(false);
      setOpenAddCommentModal(true);
      setShowDiscardCommentModal(false);
      setHasPostCommentContent(true);
    }
  }, [clickCancelCommentDiscard]);

  useEffect(() => {
    if (!openAddCommentModal) {
      setImageUrlsList([]);
    }
  }, [openAddCommentModal]);

  useEffect(() => {
    if (viewPrevImageRef.current && viewNextImageRef.current) {
      if (sortedUrlImages.length <= 1) {
        viewPrevImageRef.current.style.display = 'none';
        viewNextImageRef.current.style.display = 'none';
      } else {
        viewPrevImageRef.current.style.display = 'block';
        viewNextImageRef.current.style.display = 'block';
      }
    }
  }, [currentViewImage, openViewImageModal, sortedUrlImages]);

  useEffect(() => {
    //Xem imageChoseToView là cái nào, tìm index => set index hiện tại trở thành index của imageChoseToView và tiếp tục
    let currentImageChoseToView;
    //Đối với ảnh nằm trên cloudinary
    if (
      imageChoseToView &&
      imageChoseToView.includes('https://res.cloudinary.com/')
    ) {
      currentImageChoseToView = sortedUrlImages.find(
        (image) => image.attacheditem_path === imageChoseToView
      );
    } else {
      //Đối với ảnh nằm trên local folder
      currentImageChoseToView = sortedUrlImages.find(
        (image) =>
          `${apiBaseUrl}` + image.attacheditem_path === imageChoseToView
      );
    }
    setCurrentViewImageIndex(sortedUrlImages.indexOf(currentImageChoseToView));
  }, [imageChoseToView]);

  useEffect(() => {
    if (imagesOfCurrentCommentDragging) {
      const mappedInfor = imagesOfCurrentCommentDragging.map((element) => {
        return element.attacheditem_comment_path;
      });
      setMappedImagesOfCurrentCommentDragging(mappedInfor);
    }
  }, [openViewImageCommentModal, imagesOfCurrentCommentDragging]);

  useEffect(() => {
    if (viewPrevCommentImageRef.current && viewNextCommentImageRef.current) {
      if (mappedImagesOfCurrentCommentDragging.length <= 1) {
        viewPrevCommentImageRef.current.style.display = 'none';
        viewNextCommentImageRef.current.style.display = 'none';
      } else {
        viewPrevCommentImageRef.current.style.display = 'block';
        viewNextCommentImageRef.current.style.display = 'block';
      }
    }
  }, [
    currentViewImageComment,
    openViewImageCommentModal,
    mappedImagesOfCurrentCommentDragging,
    sortedUrlImagesComment,
  ]);

  useEffect(() => {
    //Xem imageChoseToViewComment là cái nào, tìm index => set index hiện tại trở thành index của imageChoseToViewComment và tiếp tục
    let currentImageChoseToViewComment;
    //Đối với ảnh nằm trên cloudinary
    if (
      imageChoseToViewComment &&
      imageChoseToViewComment.includes('https://res.cloudinary.com/')
    ) {
      currentImageChoseToViewComment = imagesOfCurrentCommentDragging
        .map((element) => element.attacheditem_comment_path)
        .find((path) => imageChoseToViewComment === path);
    } else {
      //Đối với ảnh nằm trên local folder
      currentImageChoseToViewComment = imagesOfCurrentCommentDragging
        .map((element) => element.attacheditem_comment_path)
        .find((path) => imageChoseToViewComment === `${apiBaseUrl}${path}`);
    }
    setCurrentViewImageCommentIndex(
      mappedImagesOfCurrentCommentDragging.indexOf(
        currentImageChoseToViewComment
      )
    );
  }, [imageChoseToViewComment, openViewImageCommentModal]);

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
    if (isEditingComment && commentEditableRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(commentEditableRef.current);
      range.collapse(false); // Đặt con trỏ ở cuối nội dung
      selection.removeAllRanges();
      selection.addRange(range);
      commentEditableRef.current.focus();
    }
  }, [isEditingComment]);

  //Counting redundant editing characters number
  useEffect(() => {
    if (contentForUpdate) {
      const countRedundantCharacter =
        numberCharactersAllowed - contentForUpdate.length; //Số lượng kí tự dư thừa
      setRedundantEditingCharactersNumber(countRedundantCharacter);
    }
  }, [contentForUpdate, redundantEditingCharactersNumber, chosenPost]);

  //Counting redundant editing comment characters number
  useEffect(() => {
    if (commentForUpdate) {
      const countRedundantCommentCharacter =
        numberCharactersAllowed - commentForUpdate.length; //Số lượng kí tự dư thừa
      setRedundantEditingCommentCharactersNumber(
        countRedundantCommentCharacter
      );
    }
  }, [commentForUpdate, redundantEditingCommentCharactersNumber]);

  useEffect(() => {
    if (selectedCommentRemoveEdit) {
      console.log('selected remove edit', selectedCommentRemoveEdit);
      setCommentForUpdate(selectedCommentRemoveEdit.comment_content);
    }
  }, [selectedCommentRemoveEdit]);

  useEffect(() => {
    if (
      isEditingComment ||
      isSuccessFullyRemoved ||
      commentsByPostId.length > 0
    ) {
      getCommentsByPostId(chosenPost);
    }
  }, [isEditingComment, isSuccessFullyRemoved, commentsByPostId.length]);

  useEffect(() => {
    const htmlPage = document.getElementsByTagName('html')[0];
    const body = document.getElementsByTagName('body')[0];
    const stickyHeader = document.getElementById('sticky-header');
    if (
      postModal ||
      openAddCommentModal ||
      openDeleteCommentModal ||
      openViewAvatarImage ||
      openViewImageModal ||
      openViewImageCommentModal
    ) {
      stickyHeader.classList.remove('z-10');
      htmlPage.classList.add('no-scroll');
      body.classList.add('no-scroll');
    } else {
      stickyHeader.classList.add('z-10');
      htmlPage.classList.remove('no-scroll');
      body.classList.remove('no-scroll');
    }
  }, [
    postModal,
    openAddCommentModal,
    openDeleteCommentModal,
    openViewAvatarImage,
    openViewImageModal,
    openViewImageCommentModal,
  ]);

  // Handle modals and z-index
  useEffect(() => {
    const updateZIndex = () => {
      const addPostIcon = addPostIconRef.current;
      const logoutIcon = logoutIconRef.current;

      if (addPostIcon) {
        if (
          postModal ||
          openOptionsModal ||
          openCommentOptionsModal ||
          openDeleteModal ||
          openCancelEditingModal ||
          openDeleteCommentModal ||
          openChangePostStatusModal
        ) {
          addPostIcon.classList.add('hidden');
        } else {
          addPostIcon.classList.remove('hidden');
          addPostIcon.style.zIndex = '1000';
        }
      }

      if (logoutIcon) {
        if (
          postModal ||
          openOptionsModal ||
          openCommentOptionsModal ||
          openDeleteModal ||
          openCancelEditingModal ||
          openDeleteCommentModal ||
          openChangePostStatusModal
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
    postModal,
    openOptionsModal,
    openCommentOptionsModal,
    openDeleteModal,
    openCancelEditingModal,
    openDeleteCommentModal,
    openChangePostStatusModal,
  ]);

  useEffect(() => {
    const countRedundantCharacter =
      numberCharactersAllowed - postContent.length; //Số lượng kí tự dư thừa
    setRedundantCharactersNumber(countRedundantCharacter);
  }, [postContent]);

  useEffect(() => {
    const countRedundantCommentCharacter =
      numberCharactersAllowed - commentContent.length; //Số lượng kí tự dư thừa
    setRedundantCommentCharactersNumber(countRedundantCommentCharacter);
  }, [commentContent]);

  // Ensure the event listener is added only once when component mounts
  useEffect(() => {
    const container = scrollContainerPostRef.current;
    if (container) {
      container.addEventListener('mousedown', handleSwipePostImage);
    }

    // Clean up the event listener on unmount
    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleSwipePostImage);
      }
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerPostCommonRef.current;
    if (container) {
      container.addEventListener('mousedown', handleSwipePostCommonImage);
    }

    // Clean up the event listener on unmount
    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleSwipePostCommonImage);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize refs array
    if (!scrollContainerCommentImageRef.current) {
      scrollContainerCommentImageRef.current = [];
    }

    scrollContainerCommentImageRef.current = new Array(commentsByPostId.length)
      .fill(null)
      .map(() => createRef());

    scrollContainerCommentImageRef.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.addEventListener('mousedown', (e) =>
          handleSwipeCommentImage(e, index)
        );
      }
    });

    return () => {
      scrollContainerCommentImageRef.current.forEach((ref, index) => {
        if (ref && ref.current) {
          ref.current.removeEventListener('mousedown', (e) =>
            handleSwipeCommentImage(e, index)
          );
        }
      });
    };
  }, [commentsByPostId.length, scrollContainerCommentImageRef]);

  //Click outside of options modal
  const handleClickOutsideOptionsModal = (event) => {
    if (
      optionsModalRef.current &&
      !optionsModalRef.current.contains(event.target)
    ) {
      setOpenOptionsModal(false);
    }
  };

  //Click outside of comment options modal
  const handleClickOutsideCommentOptionsModal = (event) => {
    if (
      commentOptionsModalRef.current &&
      !commentOptionsModalRef.current.contains(event.target)
    ) {
      setOpenCommentOptionsModal(false);
    }
    // else if(){
    //   commentOptionsModalRef.current && !commentOptionsModalRef.current.contains(event.target)
    // }
  };

  //Click outside of editing user information modal
  const handleClickOutsideEditingUserInformationModal = (event) => {
    if (
      editUserInformationModalRef.current &&
      !editUserInformationModalRef.current.contains(event.target)
    ) {
      // Hiển thị modal confirm canceling edit
      handleOpenWarningCancelEditingUserInformation();
    }
  };

  const handleOpenWarningCancelEditingUserInformation = () => {
    setOpenWarningCancelEditingUserInformation(true);
  };

  const handleFinallyCancelEditingUserInformation = () => {
    setImageAvatar([]);
    setPreViewImageAvater([]);
    setOpenWarningCancelEditingUserInformation(false);
    setOpenEditUserInformationModal(false);
  };

  const handleInputEditingUserInformationBlur = () => {
    setUsernameForUpdate(
      usernameEditableRef.current.innerText || usernameBeforeUpdate
    );
    setNicknameForUpdate(nicknameEditableRef.current.innerText);
    setBiographyForUpdate(biographyEditableRef.current.innerText);
  };

  const handleUpdateUserInformation = async () => {
    let nicknameFinal;
    let biographyFinal;
    if (nicknameEditableRef.current.innerText.trim().length === 0) {
      nicknameFinal = null;
    } else {
      nicknameFinal = nicknameEditableRef.current.innerText;
    }

    if (biographyEditableRef.current.innerText.trim().length === 0) {
      biographyFinal = null;
    } else {
      biographyFinal = biographyEditableRef.current.innerText;
    }
    try {
      const username = usernameEditableRef.current.innerText.trim();
      if (
        (usernameBeforeUpdate !== null && usernameBeforeUpdate !== '') ||
        (usernameForUpdate !== null && usernameForUpdate !== '') ||
        (username !== null && username !== '') ||
        usernameForUpdate.trim().length !== 0
      ) {
        if (imageAvatar && imageAvatar.length > 0) {
          console.log('Cập nhật ảnh');
          // Tải ảnh lên Cloudinary
          const imageUrls = await Promise.all(
            imageAvatar.map(async (file) => {
              const url = await uploadAvatarImageToCloudinary(file);
              return url;
            })
          );
          await axios.patch(
            `${apiBaseUrl}/users/update-user-information/${currentUserInfor.user_id}`,
            {
              username: usernameForUpdate || usernameBeforeUpdate || username,
              nickname: nicknameFinal,
              biography: biographyFinal,
              images_only_one: JSON.stringify(imageUrls),
            }
          );
          toast.success(
            'Cập nhật thông tin thành công 😺! Đang trở về trang chủ để cập nhật thông tin mới...'
          );
          setOpenEditUserInformationModal(false);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else if (imageAvatar && imageAvatar.length === 0) {
          console.log('Không Cập nhật ảnh');
          await axios.patch(
            `${apiBaseUrl}/users/update-user-information/${currentUserInfor.user_id}`,
            {
              username: usernameForUpdate || usernameBeforeUpdate || username,
              nickname: nicknameFinal,
              biography: biographyFinal,
            }
          );
          toast.success(
            'Cập nhật thông tin thành công 😺! Đang trở về trang chủ để cập nhật thông tin mới...'
          );
          setOpenEditUserInformationModal(false);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          console.log('Xoá ảnh đại diện hiện tại');
          await axios.patch(
            `${apiBaseUrl}/users/update-user-information/${currentUserInfor.user_id}`,
            {
              username: usernameForUpdate || usernameBeforeUpdate || username,
              nickname: nicknameFinal,
              biography: biographyFinal,
              avatar_default_path: './user-avatar-default.png',
            }
          );
          toast.success(
            'Cập nhật thông tin thành công 😺! Đang trở về trang chủ để cập nhật thông tin mới...'
          );
          setOpenEditUserInformationModal(false);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        toast.error('Tên của bạn không được để trống 😿.');
      }
    } catch (err) {
      console.log('Error when updating user information', err);
      toast.error('Cập nhật không thành công. Vui lòng thử lại 😿.');
    }
  };

  const handleClickOutsideViewAvatarImage = (event) => {
    if (
      imageAvatarViewingRef.current &&
      !imageAvatarViewingRef.current.contains(event.target)
    ) {
      setOpenViewAvatarImage(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideViewAvatarImage);
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideViewAvatarImage
      );
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideOptionsModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideOptionsModal);
    };
  }, []);

  useEffect(() => {
    document.addEventListener(
      'mousedown',
      handleClickOutsideCommentOptionsModal
    );
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideCommentOptionsModal
      );
    };
  }, []);

  useEffect(() => {
    document.addEventListener(
      'mousedown',
      handleClickOutsideEditingUserInformationModal
    );
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideEditingUserInformationModal
      );
    };
  }, []);

  return (
    <div className='container w-full md:w-[95%] max-w-screen-xl mx-auto relative'>
      {/*  */}
      {openConfirmLogout && (
        <div
          style={{ display: 'flex' }}
          className='fixed z-[1001] top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center'
        >
          <div className='w-full h-full flex sm2:justify-center sm2:items-center'>
            <div id='confirm-logout-modal' className='relative z-20'>
              <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                <div className='font-semibold text-center mb-4 mt-2'>
                  Bạn có chắc chắn muốn đăng xuất?
                </div>
                <hr className='' />
                <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                  <div
                    id='continue-remaining-login-session'
                    onClick={() => setOpenConfirmLogout(false)}
                    className='col-span-1 cursor-pointer p-2'
                  >
                    Không
                  </div>
                  <div
                    onClick={handleFinallyLogout}
                    id='finally-logout'
                    className='col-span-1 font-bold tracking-wide p-2 text-red-500 cursor-pointer'
                  >
                    Đăng xuất
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit user information */}
      {openEditUserInformationModal && (
        <div
          style={{ display: 'flex' }}
          className='fixed z-[1001] top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center'
        >
          <div className='w-full h-full flex sm2:justify-center sm2:items-center'>
            <div
              ref={editUserInformationModalRef}
              className='relative flex sm2:block justify-center items-center sm2:rounded-3xl sm2:h-max p-5 sm2:p-9 bg-white w-full sm2:w-[600px]'
            >
              <div
                ref={closeEditUserInformationModelRef}
                onClick={() => handleOpenWarningCancelEditingUserInformation()}
                className='sm2:hidden absolute top-5 left-8 cursor-pointer'
              >
                Đóng
              </div>
              <div
                onClick={handleUpdateUserInformation}
                className='sm2:hidden absolute top-5 right-8 cursor-pointer font-semibold text-blue-400 hover:text-blue-500'
              >
                Xong
              </div>
              <div className='sm2:hidden absolute top-5 left-1/2 -translate-x-1/2 font-bold'>
                Cập nhật thông tin
              </div>
              <div className='w-full rounded-3xl shadow-sm sm2:shadow-none p-6 sm2:p-0 sm2:rounded-none border sm2:border-none border-slate-300'>
                <div className='relative my-name-and-avatar flex'>
                  <div className='name w-[90%]'>
                    <div className='font-bold'>Tên</div>
                    <div
                      id='vulv-update-user-infor-username'
                      contentEditable={true}
                      ref={usernameEditableRef}
                      onBlur={handleInputEditingUserInformationBlur}
                      suppressContentEditableWarning={true} //Tránh cảnh báo từ React
                      className=' whitespace-pre-wrap break-words'
                    >
                      {currentUserInfor && currentUserInfor.username}
                    </div>
                  </div>

                  <div className='cursor-pointer absolute top-0 right-0 avatar shrink-0'>
                    {/* {currentUserInfor && !currentUserInfor.avatar_path && (
                      // <div
                      //   onClick={(e) => handleChangeNewImage(e)}
                      //   className='absolute top-0 right-0 z-10 bg-white rounded-full'
                      // >
                      //   <BiPlusCircle />
                      // </div>
                    )} */}
                    <img
                      className='w-12 h-12 rounded-full bg-no-repeat bg-center object-cover'
                      onClick={(e) => handleChangeNewImage(e)}
                      ref={imageAvatarChosenRef}
                      src={
                        previewImageAvatar && previewImageAvatar.length > 0
                          ? previewImageAvatar[0]
                          : (currentUserInfor &&
                              currentUserInfor?.avatar_path) ||
                            './user-avatar-default.png'
                      }
                      alt='my-avatar'
                    />
                  </div>
                  <input
                    id='bi-attachment-add-avatar-image'
                    hidden
                    accept='image/jpeg,image/png'
                    type='file'
                    onChange={(e) => handleFileAvatarImageChange(e)}
                  />
                  {openOptionsAvatarImageModal && (
                    <div
                      ref={optionsAvatarImageModalRef}
                      className='absolute duration-300 ease-in-out top-[3.5rem] right-0 w-[165px] h-full'
                    >
                      <div className='bg-white rounded-2xl border border-slate-300 p-2 shadow-sm'>
                        {previewImageAvatar &&
                        previewImageAvatar[0] ===
                          './user-avatar-default.png' ? (
                          <div
                            onClick={handleClickAddAvatarImageIcon}
                            className='font-semibold cursor-pointer hover:bg-slate-100 px-2 py-2 rounded-md'
                          >
                            Tải ảnh lên
                          </div>
                        ) : (
                          <>
                            <div
                              onClick={handleClickAddAvatarImageIcon}
                              className='font-semibold cursor-pointer hover:bg-slate-100 px-2 py-2 rounded-md'
                            >
                              Tải ảnh lên
                            </div>
                            <div
                              onClick={handleRemoveCurrentAvatarImageIcon}
                              className='font-semibold cursor-pointer hover:bg-slate-100 px-2 py-2 rounded-md'
                            >
                              Xoá ảnh hiện tại
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <hr className='my-3 w-[85%]' />
                <div className='my-nickname'>
                  <div className='font-bold'>Biệt danh</div>
                  <div
                    id='vulv-update-user-infor-nickname'
                    contentEditable={true}
                    ref={nicknameEditableRef}
                    onBlur={handleInputEditingUserInformationBlur}
                    suppressContentEditableWarning={true} //Tránh cảnh báo từ React
                    className='whitespace-pre-wrap break-words'
                  >
                    {currentUserInfor && currentUserInfor?.nickname}
                  </div>
                </div>
                <hr className='my-3' />
                <div className='my-biography sm2:mb-5'>
                  <div className='font-bold'>Tiểu sử</div>
                  <div
                    id='vulv-update-user-infor-bio'
                    contentEditable={true}
                    ref={biographyEditableRef}
                    onBlur={handleInputEditingUserInformationBlur}
                    suppressContentEditableWarning={true} //Tránh cảnh báo từ React
                    className='whitespace-pre-wrap break-words'
                  >
                    {currentUserInfor && currentUserInfor?.biography}
                  </div>
                </div>
                <div
                  onClick={handleUpdateUserInformation}
                  className='hidden sm2:block font-bold duration-200 ease-in-out hover:bg-black hover:text-white cursor-pointer text-center rounded-3xl border border-slate-300 px-4 py-2'
                >
                  Xong
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewing avatar image of an user */}
      {openViewAvatarImage && (
        <>
          <div
            style={{ display: 'flex' }}
            className='fixed z-[1001] top-0 left-0 w-full h-full bg-slate-500 bg-opacity-75 flex items-center justify-center'
          >
            <div ref={imageAvatarViewingRef} className='rounded-full'>
              <img
                src={
                  myImageAvatarRef && myImageAvatarRef.current
                    ? myImageAvatarRef.current.src
                    : imageAvatarChosenUserProfileRef &&
                      imageAvatarChosenUserProfileRef.current
                    ? imageAvatarChosenUserProfileRef.current.src
                    : './user-avatar-default.png'
                }
                alt=''
                className='rounded-full w-[250px] h-[250px] sm2:w-[500px] sm2:h-[500px] mx-auto bg-center bg-no-repeat bg-cover object-cover'
              />
            </div>
          </div>
        </>
      )}

      {/* Modal warning for canceling edit user information */}
      {openWarningCancelEditingUserInformation && (
        <>
          <div
            id='background-cancel-edit-user-information-modal'
            className='z-[1001] fixed top-0 left-0 w-full h-full bg-neutral-950 bg-opacity-90'
          >
            <div className='w-full h-full flex justify-center items-center'>
              <div id='cancel-edit-user-information' className='relative z-20'>
                <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                  <div className='mb-4 mt-2'>
                    <div className='font-semibold text-center mb-4'>
                      Không tiếp tục chỉnh sửa?
                    </div>
                  </div>
                  <hr className='' />
                  <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                    <div
                      id='cancel-final-edit-user-information'
                      onClick={() =>
                        setOpenWarningCancelEditingUserInformation(false)
                      }
                      className='col-span-1 cursor-pointer p-2'
                    >
                      Tiếp tục
                    </div>
                    <div
                      onClick={handleFinallyCancelEditingUserInformation}
                      id='finally-cancel-edit-user-information'
                      className='col-span-1 font-bold tracking-wide p-2 text-red-500 cursor-pointer'
                    >
                      Huỷ bỏ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View images of a post */}
      {openViewImageModal && (
        <div
          style={{ display: 'flex' }}
          className='fixed z-[1001] top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center'
        >
          <div
            ref={cancelViewPostImageRef}
            className='fixed text-3xl text-slate-300 duration-300 ease-in-out hover:text-white top-3 right-3 cursor-pointer'
          >
            <BiX title='Đóng' />
          </div>

          <div id='wrapper-prev-next-icon' className=''>
            <div
              ref={viewPrevImageRef}
              onClick={handleViewPrevImage}
              className='fixed p-3 left-0 top-1/2 -translate-y-1/2 sm:left-3 text-6xl text-slate-300 opacity-50 hover:opacity-100 duration-300 ease-in-out hover:text-white cursor-pointer'
            >
              <FaAngleLeft />
            </div>
            <div
              ref={viewNextImageRef}
              onClick={handleViewNextImage}
              className='fixed p-3 right-0 top-1/2 -translate-y-1/2 sm:right-3 text-6xl text-slate-300 opacity-50 hover:opacity-100 duration-300 ease-in-out hover:text-white cursor-pointer'
            >
              <FaAngleRight />
            </div>
          </div>

          <img
            ref={imageChoseToViewRef}
            src={imageChoseToView}
            alt='image-modal'
            className='max-w-full max-h-full shadow shadow-slate-300'
          />
        </div>
      )}

      {/* View images of a comment */}
      {openViewImageCommentModal && (
        <div
          style={{ display: 'flex' }}
          className='fixed z-[1001] top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center'
        >
          <div
            ref={cancelViewCommentImageRef}
            className='fixed text-3xl text-slate-300 duration-300 ease-in-out hover:text-white top-3 right-3 cursor-pointer'
          >
            <BiX title='Đóng' />
          </div>

          <div id='wrapper-prev-next-icon-comment' className=''>
            <div
              ref={viewPrevCommentImageRef}
              onClick={handleViewPrevCommentImage}
              className='fixed p-3 left-0 top-1/2 -translate-y-1/2 sm:left-3 text-6xl text-slate-300 opacity-50 hover:opacity-100 duration-300 ease-in-out hover:text-white cursor-pointer'
            >
              <FaAngleLeft />
            </div>
            <div
              ref={viewNextCommentImageRef}
              onClick={handleViewNextCommentImage}
              className='fixed p-3 right-0 top-1/2 -translate-y-1/2 sm:right-3 text-6xl text-slate-300 opacity-50 hover:opacity-100 duration-300 ease-in-out hover:text-white cursor-pointer'
            >
              <FaAngleRight />
            </div>
          </div>

          <img
            ref={imageChoseToViewCommentRef}
            src={imageChoseToViewComment}
            alt='image-modal'
            className='max-w-full max-h-full shadow shadow-slate-300'
          />
        </div>
      )}

      {/* Modal for adding comment of a post */}
      {openAddCommentModal && (
        <div
          style={{ display: 'flex' }}
          className='fixed z-[1001] top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center'
        >
          <div className='w-full h-full flex sm2:justify-center sm2:items-center'>
            <div className='comment-content relative sm2:rounded-3xl bg-white sm2:w-[65%] md:w-[60%] lg:w-[50%]'>
              <div className='px-8 py-6 w-[100vw] sm2:w-full h-full'>
                <div className='number-of-redundant-characters absolute right-[1.5rem] top-[4.75rem] sm2:top-[3rem] sm2:right-[1.5rem] text-red-600'>
                  {redundantCommentCharactersNumber < 0
                    ? redundantCommentCharactersNumber
                    : ''}
                </div>
                <div className='absolute sm2:top-[1.2rem] sm2:right-[1.5rem]'>
                  <div
                    onClick={(e) => {
                      handleClosePostCommentModal(e);
                    }}
                    className='post-cancel font-semibold text-red-500 opacity-55 hover:opacity-75 text-base cursor-pointer left-[2.0rem] top-[1.8rem] '
                  >
                    Huỷ
                  </div>
                </div>
                <div className='post-content-description mt-10 sm2:my-0'>
                  <div className='w-[90%] sm:w-[95%]'>
                    <div className='fixed'>
                      <img
                        className='w-[50px] h-[50px] rounded-full bg-no-repeat bg-center bg-cover object-cover'
                        src={
                          currentUserInfor
                            ? currentUserInfor?.avatar_path ||
                              './user-avatar-default.png'
                            : adminInfor?.avatar_path
                        }
                        alt=''
                      />
                    </div>
                    <div className='ml-0 sm:ml-16'>
                      <div className='pt-14 sm:pt-0'>
                        <div className='font-semibold tracking-wide'>
                          {currentUserInfor && currentUserInfor.username}
                        </div>
                        <div className='w-full sm2:w-[95%]'>
                          {/* Display images before uploading to database */}
                          <div
                            ref={scrollContainerPostCommonRef}
                            className='vulv-uploaded-images vulv-scrollbar-hide flex flex-row gap-2 overflow-x-auto w-full sm:w-[95%] mb-2'
                            onMouseDown={(e) => handleSwipePostCommonImage(e)}
                            onDragStart={(e) => e.preventDefault()}
                          >
                            {imageUrlsList.map((url, index) => (
                              <img
                                key={index}
                                // ref={postItemsUploadRef}
                                src={url}
                                className='w-[50%] sm2:w-[25%] h-auto rounded-lg'
                                alt={`Preview ${index}`}
                              />
                            ))}
                          </div>
                          <textarea
                            ref={textareaCommentRef}
                            onChange={(e) => handleClickPostNewComment(e)}
                            className='w-full tracking-wide sm:w-[95%] h-[150px] leading-loose break-words whitespace-pre-wrap outline-none resize-none'
                            name=''
                            id='post-comment-content-details'
                            placeholder='Viết ý kiến của bạn...'
                          ></textarea>
                        </div>
                        <hr className='my-1 w-[95%] sm:w-[87%] sm2:w-[84%]' />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='list-icon-attachment sm:ml-14'>
                  <ul className='flex gap-5 text-2xl mt-3 sm2:mt-2 cursor-pointer '>
                    <li
                      id='upload-attachment-icon'
                      onClick={handleClickAddCommentImageIcon}
                    >
                      <BiImageAdd />
                    </li>
                    {/* <li>
                    <BiVideoPlus />
                  </li>
                  <li>
                    <BiUserVoice />
                  </li>
                  <li>
                    <BiFileBlank />
                  </li> */}
                  </ul>
                </div>
                <input
                  id='bi-attachment-comment-add'
                  hidden
                  accept='image/jpeg,image/png,video/mp4,video/quicktime'
                  type='file'
                  multiple
                  onChange={(e) => handleFileOfCommentChange(e)}
                />
                <div className='post-myself-button'>
                  {hasPostCommentContent || imageUrlsList.length !== 0 ? (
                    <button
                      onClick={() => handleCreateComment(chosenPost)}
                      className='post-button absolute right-[1.25rem] bottom-[1.25rem] font-semibold px-4 py-2 my-auto border-slate-400 rounded-xl shadow shadow-slate-300'
                    >
                      Đăng
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      className='post-button absolute right-[1.25rem] bottom-[1.25rem] font-semibold px-4 py-2 my-auto border-slate-400 opacity-50 rounded-xl shadow shadow-slate-300'
                    >
                      Đăng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!role ? (
        <Link to={'/login'}>
          <div
            id='log-in-icon'
            className='z-[1000] flex items-center gap-2 rounded-full bg-white hover:bg-slate-100 duration-300 ease-in-out border border-slate-300 shadow shadow-slate-200 fixed left-3 bottom-4 xl:bottom-9 xl:left-14 cursor-pointer'
          >
            <div className='text-xl p-2 sm2:text-2xl sm2:p-3' title='Đăng nhập'>
              <BiLogIn />
            </div>
          </div>
        </Link>
      ) : (
        <div
          id='log-out-icon'
          ref={logoutIconRef}
          className='z-[1000] flex items-center gap-2 rounded-full bg-white hover:bg-slate-100 duration-300 ease-in-out border border-slate-300 shadow shadow-slate-200 fixed left-3 bottom-4 xl:bottom-9 xl:left-14 cursor-pointer'
        >
          <div
            onClick={() => setOpenConfirmLogout(true)}
            className='text-xl p-2 sm2:text-2xl sm2:p-3'
            title='Đăng xuất'
          >
            <BiLogOut />
          </div>
        </div>
      )}

      {role ? (
        <div
          id='add-post-icon'
          ref={addPostIconRef}
          className='z-[1000] flex items-center gap-2 rounded-full bg-white hover:bg-slate-100 duration-300 ease-in-out border border-slate-300 shadow shadow-slate-200 fixed right-3 bottom-4 xl:bottom-9 xl:right-14 cursor-pointer'
        >
          <div
            onClick={handleOpenPostModal}
            className='text-xl p-2 sm2:text-2xl sm2:p-3'
            title='Viết bài'
          >
            <BiPencil />
          </div>
        </div>
      ) : (
        ''
      )}

      {/* Successful notification after creating post */}
      <ToastContainer />

      {/* Discard new content modal */}
      <div
        className='discard-modal z-20 fixed top-0 left-0 w-full h-full bg-black bg-opacity-90'
        style={{ display: showdiscardModal ? 'block' : 'none' }}
      >
        <div className='bg-white h-[120px] rounded-2xl fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          <div className='grid divide-y-2 w-[280px] h-full'>
            <div className='mx-auto my-auto font-bold tracking-wide'>
              Loại bỏ bài đăng này?
            </div>
            <div className='flex relative'>
              <div className='absolute border border-slate-200 h-full font-medium text-xl left-1/2'></div>
              <button
                onClick={() => setClickCancelDiscard(true)}
                className='basis-1/2 relative before:absolute before:inset-0 before:-my-4 before:content-[""] mx-auto my-auto cursor-pointer'
              >
                Tiếp tục viết
              </button>
              <button
                onClick={() => setDiscard(true)}
                className='basis-1/2 relative before:absolute before:inset-0 before:-my-4 before:content-[""] mx-auto my-auto font-bold tracking-wide text-red-500 cursor-pointer'
              >
                Loại bỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Discard new comment modal */}
      {showdiscardCommentModal && (
        <div className='discard-comment-modal z-[1002] fixed top-0 left-0 w-full h-full bg-black bg-opacity-90'>
          <div className='bg-white h-[120px] rounded-2xl fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
            <div className='grid divide-y-2 w-[280px] h-full'>
              <div className='mx-auto my-auto font-bold tracking-wide'>
                Loại bỏ bình luận này?
              </div>
              <div className='flex relative'>
                <div className='absolute border border-slate-200 h-full font-medium text-xl left-1/2'></div>
                <button
                  onClick={() => setClickCancelCommentDiscard(true)}
                  className='basis-1/2 relative before:absolute before:inset-0 before:-my-4 before:content-[""] mx-auto my-auto cursor-pointer'
                >
                  Tiếp tục
                </button>
                <button
                  onClick={() => setDiscardComment(true)}
                  className='basis-1/2 relative before:absolute before:inset-0 before:-my-4 before:content-[""] mx-auto my-auto font-bold tracking-wide text-red-500 cursor-pointer'
                >
                  Loại bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal delete comment */}
      {openDeleteCommentModal && (
        <>
          <div
            id='background-delete-comment-modal'
            className='z-[1001] fixed top-0 left-0 w-full h-full bg-neutral-700 bg-opacity-90'
          >
            <div className='w-full h-full flex justify-center items-center'>
              <div id='delete-comment-modal' className='relative z-20'>
                <div className=' bg-white w-[220px] sm2:w-[320px] rounded-2xl p-3'>
                  <div className='mb-4'>
                    <div className='font-semibold text-center mb-4'>
                      Xoá bình luận?
                    </div>
                    <div className='text-center mb-3'>
                      Sau khi xoá, bạn sẽ không thể khôi phục.
                    </div>
                  </div>
                  <hr className='' />
                  <div className='grid grid-cols-2 text-center divide-x-2 -mb-2'>
                    <div
                      id='cancel-final-delete-comment'
                      onClick={() => setOpenDeleteCommentModal(false)}
                      className='col-span-1 cursor-pointer p-2'
                    >
                      Huỷ
                    </div>
                    <div
                      onClick={handleFinallyRemoveComment}
                      id='finally-delete-comment'
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

      {/* Post new content modal */}
      <div
        style={{
          display: postModal ? 'block' : 'none',
        }}
        className='modal-new-post z-10 fixed top-0 left-0 w-full h-full bg-black bg-opacity-75'
      >
        <div className='w-full h-full flex sm2:justify-center sm2:items-center'>
          <div className='post-content relative sm2:rounded-3xl bg-white sm2:w-[65%] md:w-[60%] lg:w-[50%]'>
            <div className='px-8 py-6 w-[100vw] sm2:w-full h-full'>
              <div className='number-of-redundant-characters absolute right-[1.5rem] top-[4.75rem] sm2:top-[3rem] sm2:right-[1.5rem] text-red-600'>
                {redundantCharactersNumber < 0 ? redundantCharactersNumber : ''}
              </div>
              <div className='absolute sm2:top-[1.2rem] sm2:right-[1.5rem]'>
                <div
                  onClick={(e) => {
                    handleClosePostModal(e);
                  }}
                  className='post-cancel font-semibold text-red-500 opacity-55 hover:opacity-75 text-base cursor-pointer left-[2.0rem] top-[1.8rem] '
                >
                  Huỷ
                </div>
              </div>
              <div className='post-content-description mt-10 sm2:my-0'>
                <div className='w-[90%] sm:w-[95%]'>
                  <div className='fixed'>
                    <img
                      className='w-[50px] h-[50px] rounded-full bg-no-repeat bg-center bg-cover object-cover'
                      src={
                        currentUserInfor
                          ? currentUserInfor?.avatar_path ||
                            './user-avatar-default.png'
                          : adminInfor?.avatar_path
                      }
                      alt=''
                    />
                  </div>
                  <div className='ml-0 sm:ml-16'>
                    <div className='pt-14 sm:pt-0'>
                      <div className='font-semibold tracking-wide'>
                        {currentUserInfor && currentUserInfor.username}
                      </div>
                      <div className='w-full sm2:w-[95%]'>
                        {/* Display images before uploading to database */}
                        <div
                          ref={scrollContainerPostCommonRef}
                          className='vulv-uploaded-images vulv-scrollbar-hide flex flex-row gap-2 overflow-x-auto w-full sm:w-[95%] mb-2'
                          onMouseDown={(e) => handleSwipePostCommonImage(e)}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          {imageUrlsList.map((url, index) => (
                            <img
                              key={index}
                              ref={postItemsUploadRef}
                              src={url}
                              className='w-[50%] sm2:w-[25%] h-auto rounded-lg'
                              alt={`Preview ${index}`}
                            />
                          ))}
                        </div>
                        <textarea
                          ref={textareaRef}
                          onChange={(e) => handleClickPostNew(e)}
                          className='w-full tracking-wide sm:w-[95%] h-[150px] leading-loose break-words whitespace-pre-wrap outline-none resize-none'
                          name=''
                          id='post-content-details'
                          placeholder='Viết ra những suy nghĩ của bạn...'
                        ></textarea>
                      </div>
                      <hr className='my-1 w-[95%] sm:w-[87%] sm2:w-[84%]' />
                    </div>
                  </div>
                </div>
              </div>

              <div className='list-icon-attachment sm:ml-14'>
                <ul className='flex gap-5 text-2xl mt-3 sm2:mt-2 cursor-pointer '>
                  <li
                    id='upload-attachment-icon'
                    onClick={handleClickAddImageIcon}
                  >
                    <BiImageAdd />
                  </li>
                  {/* <li>
                    <BiVideoPlus />
                  </li>
                  <li>
                    <BiUserVoice />
                  </li>
                  <li>
                    <BiFileBlank />
                  </li> */}
                </ul>
              </div>
              <input
                id='bi-attachment-add'
                hidden
                accept='image/jpeg,image/png,video/mp4,video/quicktime'
                type='file'
                multiple
                onChange={(e) => handleFileChange(e)}
              />
              <div className='post-myself-button'>
                {hasPostContent || imageUrlsList.length !== 0 ? (
                  <button
                    onClick={handleCreatePost}
                    className='post-button absolute right-[1.25rem] bottom-[1.25rem] font-semibold px-4 py-2 my-auto border-slate-400 rounded-xl shadow shadow-slate-300'
                  >
                    Đăng
                  </button>
                ) : (
                  <button
                    disabled={true}
                    className='post-button absolute right-[1.25rem] bottom-[1.25rem] font-semibold px-4 py-2 my-auto border-slate-400 opacity-50 rounded-xl shadow shadow-slate-300'
                  >
                    Đăng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='main-content flex flex-col lg:flex-row m-4'>
        <div
          id='sticky-header'
          className='max-w-screen-xl z-10 lg:max-w-[300px] sm2:sticky top-0 border-slate-50 bg-white'
        >
          <div className='left-sidebar sticky top-0 flex flex-row lg:flex-col my-5 lg:my-3 border-slate-50 bg-white'>
            <h5 id='logo-mylm' className='MyLM font-semibold text-4xl mx-auto'>
              MyLM
            </h5>
            <div className='left-sidebar-icons-wrapper mx-auto'>
              <div className='flex md:hidden justify-center items-center text-3xl cursor-pointer relative'>
                <div ref={navbarIconRef} onClick={handleClickNavbarIcon}>
                  <BiMenu id='navbar-icon-bi-menu' />
                </div>
                {showNavbarSlider && (
                  <div
                    ref={navbarSliderRef}
                    id='navbar-slide'
                    className='absolute w-[205px] md:block right-[-3.5rem] top-0 text-right px-2 py-3 bg-slate-100 border-slate-200 shadow-md rounded-xl'
                  >
                    <NavBar />
                  </div>
                )}
              </div>
              <div
                id='header-icon-bi-home'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiHome
                  id='header-icon-bi-home-before'
                  className='header-icons-common'
                />
              </div>
              <div
                id='header-icon-bi-search'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiSearch id='header-icon-bi-search-before' />
              </div>
              <div
                id='header-icon-bi-bell'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiBell id='header-icon-bi-bell-before' />
              </div>
              <div
                id='header-icon-bi-playlist'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiSolidPlaylist />
              </div>
              {role ? (
                <div
                  id='header-icon-bi-bookmark'
                  className='left-sidebar-icons'
                  onClick={handleClickHeaderIcons}
                >
                  <BiBookmark id='header-icon-bi-bookmarka-before' />
                </div>
              ) : (
                ''
              )}
              {role ? (
                <div
                  id='header-icon-bi-message'
                  className='left-sidebar-icons'
                  onClick={handleClickHeaderIcons}
                >
                  <BiMessage />
                </div>
              ) : (
                ''
              )}
              <div
                id='header-icon-profile'
                className='left-sidebar-icons'
                onClick={handleClickHeaderIcons}
              >
                <BiUser />
              </div>
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
