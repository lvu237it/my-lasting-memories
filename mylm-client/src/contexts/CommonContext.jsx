import { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CommonContext = createContext();

export const useCommon = () => useContext(CommonContext);

export const Common = ({ children }) => {
  const [showNavbarSlider, setShowNavbarSlider] = useState(false);
  const navbarIconRef = useRef(null);
  const navbarSliderRef = useRef(null);
  const [headerIconsClicked, setHeaderIconsClicked] = useState('');
  const [showIcon, setShowIcon] = useState([
    'header-icon-bi-home-before',
    'header-icon-bi-search-before',
    'header-icon-bi-bell-before',
    'header-icon-bi-playlist',
    'header-icon-bi-bookmark-before',
    'header-icon-bi-message',
    'header-icon-profile',
  ]);

  const [postModal, setPostModal] = useState(false);
  const [hasPostContent, setHasPostContent] = useState(false);
  const [showdiscardModal, setShowDiscardModal] = useState(false);
  const [clickCancelDiscard, setClickCancelDiscard] = useState(false);
  const [discard, setDiscard] = useState(false);
  const textareaRef = useRef(null);
  const addPostIconRef = useRef(null);
  const logoutIconRef = useRef(null);
  const postItemsUploadRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const imageChoseToViewRef = useRef(null);

  const [postsList, setPostsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrlsList, setImageUrlsList] = useState([]);
  const isLoggedByAdmin = JSON.parse(localStorage.getItem('admin'));
  const [adminInfor, setAdminInfor] = useState(null);
  const [isUser, setIsUser] = useState(true);

  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  const [imageChoseToView, setImageChoseToView] = useState(null);

  // const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_DEVELOPMENT;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_PRODUCTION;
  useEffect(() => {
    //Nếu tồn tại phiên đăng nhập của admin thì chuyển quyền truy cập thành admin thay vì user
    if (isLoggedByAdmin) {
      setIsUser(false);
    }
  }, [isUser]);

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

  const decodeEntities = (encodedString) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  };

  const numberCharactersAllowed = 1000;
  const [redundantCharactersNumber, setRedundantCharactersNumber] = useState(0);

  const handleClickHeaderIcons = (e) => {
    const iconId = e.currentTarget.id;
    setHeaderIconsClicked(iconId);
  };

  const handleClickNavbarIcon = () => {
    setShowNavbarSlider(!showNavbarSlider);
  };

  //Increase UX when scrolling
  const handleSwipe = (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
    const container = scrollContainerRef.current;
    if (container) {
      let startX = e.pageX - container.offsetLeft;
      let scrollLeft = container.scrollLeft;

      container.classList.add('grabbing'); //Đổi thành biểu tượng bàn tay nắm -> kéo

      const onMouseMove = (e) => {
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Tăng tốc độ cuộn
        container.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        container.classList.remove('grabbing');
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('mouseleave', onMouseUp);
      };

      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseup', onMouseUp);
      container.addEventListener('mouseleave', onMouseUp); // Xử lý trường hợp chuột rời khỏi vùng cuộn
    }
  };

  //Add attachments of post
  const handleClickAddImageIcon = () => {
    const fileInput = document.getElementById('bi-attachment-add');
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((preImages) => [...preImages, ...files]);
    // Tạo URL blob cho ảnh để xem trước
    //Với định dạng "blob:http://localhost:5173/..."
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImageUrlsList((prevUrls) => [...prevUrls, ...newImageUrls]);
    //Đọc 1 file duy nhất đầu tiên
    // const file = e.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     postItemsUploadRef.current.src = e.target.result;
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  //View image modal
  const handleOpenViewImageModal = (e) => {
    setOpenViewImageModal(true);
    const imageSrc = e.target.src;
    if (imageSrc) {
      setImageChoseToView(imageSrc);
    }
  };

  //Post Modal
  const handleOpenPostModal = () => {
    setPostModal(true);
    console.log('open modal');
  };

  const handleClosePostModal = (e) => {
    e.preventDefault();
    if (hasPostContent || imageUrlsList.length !== 0) {
      setShowDiscardModal(true);
    } else {
      setPostModal(false);
    }
  };

  const handleClickPostNew = (e) => {
    if (e.target.value.trim()) {
      setHasPostContent(true);
      console.log('change');
      setPostContent(e.target.value.trim());
    } else {
      setHasPostContent(false);
      console.log('not change');
      setPostContent('');
    }
  };

  const handleClickOutsideNavBar = (event) => {
    if (
      navbarIconRef.current &&
      navbarSliderRef.current &&
      !navbarIconRef.current.contains(event.target) &&
      !navbarSliderRef.current.contains(event.target)
    ) {
      setShowNavbarSlider(false);
    }
  };

  const handleClickOutsideImageViewModal = (event) => {
    // if (
    //   imageChoseToViewRef.current &&
    //   !imageChoseToViewRef.current.contains(event.target)
    // ) {
    setOpenViewImageModal(false);
    // }
  };

  const getAllPosts = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/posts/`);
      setPostsList(response.data);
    } catch (error) {
      console.error('Error getting all posts', error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/users/`);
      setUsersList(response.data);
    } catch (error) {
      console.error('Error getting all users', error);
    }
  };

  const getAuthorNameOfPostByUserId = (userId) => {
    const user = usersList.find((user) => user.user_id === userId);
    return user?.username;
  };

  const getAuthorAvatarByUserId = (userId) => {
    const user = usersList.find((user) => user.user_id === userId);
    return user?.avatar_path;
  };

  //Format posted time to yyyy/mm/dd
  const getPostedTime = (createdAt) => {
    return createdAt.split('T')[0];
  };

  const handleCreatePost = async () => {
    console.log('images.length', images.length);
    if (postContent.length > 1000) {
      toast.error(
        'Đăng bài không thành công. Nội dung bài đăng không được vượt quá 1000 kí tự.'
      );
    } else if (images.length > 10) {
      toast.error('Đăng bài không thành công. Tối đa không quá 10 ảnh.');
    } else {
      const formData = new FormData();
      formData.append('content', postContent);
      formData.append('user_id', '7634b4ee-e27e-4d03-8e61-d7d6d4459607'); //admin
      images.forEach((file) => {
        formData.append('images', file);
        console.log('Added image to formData:', file);
      });

      try {
        await axios.post(`${apiBaseUrl}/posts/createpost`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPostModal(false);
        textareaRef.current.value = '';
        setHasPostContent(false);
        toast.success('Đăng bài thành công!');
        getAllPosts();
        setImageUrlsList([]);
        setImages([]);
      } catch (error) {
        console.error('Error creating post', error);
        setPostModal(false);
        toast.error('Đăng bài không thành công. Vui lòng thử lại.');
      }
    }
  };

  return (
    <CommonContext.Provider
      value={{
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
        handleFileChange,
        postModal,
        setPostModal,
        postContent,
        setPostContent,
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
        scrollContainerRef,
        images,
        setImages,
        imageUrlsList,
        setImageUrlsList,
        handleSwipe,
        getAllUsers,
        getAllPosts,
        postsList,
        usersList,
        getAuthorNameOfPostByUserId,
        getAuthorAvatarByUserId,
        getPostedTime,
        handleCreatePost,
        ToastContainer,
        addPostIconRef,
        logoutIconRef,
        redundantCharactersNumber,
        setRedundantCharactersNumber,
        numberCharactersAllowed,
        isUser,
        setIsUser,
        isLoggedByAdmin,
        adminInfor,
        openViewImageModal,
        setOpenViewImageModal,
        handleOpenViewImageModal,
        imageChoseToViewRef,
        handleClickOutsideImageViewModal,
        imageChoseToView,
        setImageChoseToView,
        decodeEntities,
        apiBaseUrl,
        // notify,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
