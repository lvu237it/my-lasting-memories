import { createContext, useContext, useRef, useState } from 'react';
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
  ]);

  const [postModal, setPostModal] = useState(false);
  const [hasPostContent, setHasPostContent] = useState(false);
  const [showdiscardModal, setShowDiscardModal] = useState(false);
  const [clickCancelDiscard, setClickCancelDiscard] = useState(false);
  const [discard, setDiscard] = useState(false);
  const textareaRef = useRef(null);
  const addPostIconRef = useRef(null);

  const [postsList, setPostsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [postContent, setPostContent] = useState('');

  const [redundantCharactersNumber, setRedundantCharactersNumber] = useState(0);

  const handleClickHeaderIcons = (e) => {
    const iconId = e.currentTarget.id;
    setHeaderIconsClicked(iconId);
  };

  const handleClickNavbarIcon = () => {
    setShowNavbarSlider(!showNavbarSlider);
  };

  const handleOpenPostModal = () => {
    setPostModal(true);
    console.log('open modal');
  };

  const handleClosePostModal = (e) => {
    e.preventDefault();
    if (hasPostContent) {
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

  const handleClickOutside = (event) => {
    if (
      navbarIconRef.current &&
      navbarSliderRef.current &&
      !navbarIconRef.current.contains(event.target) &&
      !navbarSliderRef.current.contains(event.target)
    ) {
      setShowNavbarSlider(false);
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/posts/');
      setPostsList(response.data);
    } catch (error) {
      console.error('Error getting all posts', error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/users/');
      setUsersList(response.data);
    } catch (error) {
      console.error('Error getting all users', error);
    }
  };

  const getAuthorNameOfPostByUserId = (userId) => {
    const user = usersList.find((user) => user.user_id === userId);
    return user?.username;
  };

  const numberCharactersAllowed = 1000;
  const handleCreatePost = async () => {
    //content không vượt quá 1000 ký tự
    if (postContent.length > 1000) {
      toast.error(
        'Đăng bài không thành công. Nội dung bài đăng không được vượt quá 1000 kí tự.'
      );
    } else {
      try {
        await axios.post('http://127.0.0.1:3000/posts/createpost', {
          user_id: '7634b4ee-e27e-4d03-8e61-d7d6d4459607', //admin
          // user_id: 'a5d5d5ce-d544-439d-86c2-0069690245c2', //user
          content: postContent,
        });
        setPostModal(false);
        textareaRef.current.value = '';
        setHasPostContent(false);
        toast.success('Đăng bài thành công!');
        //Sau khi đăng bài thành công thì fetch lại data
        getAllPosts();
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
        handleClickOutside,
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
        getAllUsers,
        getAllPosts,
        postsList,
        usersList,
        getAuthorNameOfPostByUserId,
        handleCreatePost,
        ToastContainer,
        addPostIconRef,
        redundantCharactersNumber,
        setRedundantCharactersNumber,
        numberCharactersAllowed,
        // notify,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
