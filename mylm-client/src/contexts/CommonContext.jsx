import { createContext, useContext, useRef, useState } from 'react';

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
    } else {
      setHasPostContent(false);
      console.log('not change');
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
        hasPostContent,
        setHasPostContent,
        showdiscardModal,
        setShowDiscardModal,
        clickCancelDiscard,
        setClickCancelDiscard,
        discard,
        setDiscard,
        textareaRef,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
