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
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [hasPostContent, setHasPostContent] = useState(false);
  const [hasPostCommentContent, setHasPostCommentContent] = useState(false);
  const [showdiscardModal, setShowDiscardModal] = useState(false);
  const [showdiscardCommentModal, setShowDiscardCommentModal] = useState(false);

  const [clickCancelDiscard, setClickCancelDiscard] = useState(false);
  const [clickCancelCommentDiscard, setClickCancelCommentDiscard] =
    useState(false);
  const [discard, setDiscard] = useState(false);
  const [discardComment, setDiscardComment] = useState(false);
  const textareaRef = useRef(null);
  const textareaCommentRef = useRef(null);
  const addPostIconRef = useRef(null);
  const logoutIconRef = useRef(null);
  const postItemsUploadRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const imageChoseToViewRef = useRef(null);
  const imageChoseToViewCommentRef = useRef(null);
  const cancelViewPostImageRef = useRef(null);
  const cancelViewCommentImageRef = useRef(null);
  const viewPrevImageRef = useRef(null);
  const viewPrevCommentImageRef = useRef(null);
  const viewNextImageRef = useRef(null);
  const viewNextCommentImageRef = useRef(null);
  const contentEditableRef = useRef(null);
  const commentEditableRef = useRef(null);

  // const [containerBeforeDragging, setContainerBeforeDragging] = useState(null);

  const [contentForUpdate, setContentForUpdate] = useState('');
  const [contentBeforeUpdate, setContentBeforeUpdate] = useState('');
  const [commentForUpdate, setCommentForUpdate] = useState('');
  const [commentBeforeUpdate, setCommentBeforeUpdate] = useState('');

  const [postsList, setPostsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagesComment, setImagesComment] = useState([]);
  const [imageUrlsList, setImageUrlsList] = useState([]);
  const isLoggedByAdmin = JSON.parse(localStorage.getItem('admin'));
  const [adminInfor, setAdminInfor] = useState(null);
  const [isUser, setIsUser] = useState(true);

  const [chosenPost, setChosenPost] = useState(null);

  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  const [openViewImageCommentModal, setOpenViewImageCommentModal] =
    useState(false);

  const [imageChoseToView, setImageChoseToView] = useState(null);
  const [imageChoseToViewComment, setImageChoseToViewComment] = useState(null);

  const [localUrlImages, setLocalUrlImages] = useState([]);
  const [localUrlImagesComment, setLocalUrlImagesComment] = useState([]);

  const [lengthOfViewPostImage, setLengthOfViewPostImage] = useState(0);
  const [lengthOfViewPostImageComment, setLengthOfViewPostImageComment] =
    useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentViewImageIndex, setCurrentViewImageIndex] = useState(null);
  const [currentViewImage, setCurrentViewImage] = useState(null);
  const [currentViewImageCommentIndex, setCurrentViewImageCommentIndex] =
    useState(null);
  const [currentViewImageComment, setCurrentViewImageComment] = useState(null);

  const [commentsByPostId, setCommentsByPostId] = useState([]);
  const [openAddCommentModal, setOpenAddCommentModal] = useState(false);

  const [openOptionsModal, setOpenOptionsModal] = useState(false);
  const [openCommentOptionsModal, setOpenCommentOptionsModal] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCommentModal, setOpenDeleteCommentModal] = useState(false);
  const [openCancelEditingModal, setOpenCancelEditingModal] = useState(false);
  const [openCancelEditingCommentModal, setOpenCancelEditingCommentModal] =
    useState(false);

  const [isSuccessFullyRemoved, setIsSuccessFullyRemoved] = useState(false);

  const [selectedCommentRemoveEdit, setSelectedCommentRemoveEdit] =
    useState(null);

  const numberCharactersAllowed = 1000;
  const [redundantCharactersNumber, setRedundantCharactersNumber] = useState(0);
  const [
    redundantCommentCharactersNumber,
    setRedundantCommentCharactersNumber,
  ] = useState(0);

  const [
    redundantEditingCharactersNumber,
    setRedundantEditingCharactersNumber,
  ] = useState(0);

  const [
    redundantEditingCommentCharactersNumber,
    setRedundantEditingCommentCharactersNumber,
  ] = useState(0);

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
    console.log('isUser', isUser);
  }, []);

  const getCommentsByPostId = async (post) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/comments/post/${post.post_id}`
      );
      setCommentsByPostId(response.data);
    } catch (err) {
      console.log('Error when getting comments by post id', err);
    }
  };

  const decodeEntities = (encodedString) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  };

  const handleClickHeaderIcons = (e) => {
    const iconId = e.currentTarget.id;
    setHeaderIconsClicked(iconId);
  };

  const handleClickNavbarIcon = () => {
    setShowNavbarSlider(!showNavbarSlider);
  };

  //Increase UX when scrolling
  const handleSwipe = (e) => {
    e.preventDefault();
    const container = scrollContainerRef.current;

    if (container) {
      setIsDragging(true);
      let startX = e.pageX - container.offsetLeft;
      let scrollLeft = container.scrollLeft;

      container.classList.add('grabbing');

      const onMouseMove = (e) => {
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        setIsDragging(false);
        container.classList.remove('grabbing');
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('mouseleave', onMouseUp);
      };

      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseup', onMouseUp);
      container.addEventListener('mouseleave', onMouseUp);
    }
  };

  // useEffect(() => {
  //   if (!isDragging) {
  //     setContainerBeforeDragging(scrollContainerRef.current);
  //   }
  //   console.log('container before', containerBeforeDragging);
  // }, [containerBeforeDragging, scrollContainerRef.current]);

  // Ensure the event listener is added only once when component mounts
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleSwipe);
    }

    // Clean up the event listener on unmount
    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleSwipe);
      }
    };
  }, []);

  //Add attachments of post
  const handleClickAddImageIcon = () => {
    const fileInput = document.getElementById('bi-attachment-add');
    fileInput.click();
  };

  //Add attachments of comment
  const handleClickAddCommentImageIcon = () => {
    const fileInput = document.getElementById('bi-attachment-comment-add');
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

  const handleFileOfCommentChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesComment((preImages) => [...preImages, ...files]);
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

  useEffect(() => {
    if (!openAddCommentModal) {
      setImageUrlsList([]);
    }
  }, [openAddCommentModal]);

  const handleSortImagesPath = (localUrlImages) => {
    // Tạo mảng các đối tượng chứa attacheditem_path và phần đầu của tên ảnh
    let imagePathsWithTimestamps = localUrlImages.map((urlImageObject) => {
      // Tách phần đầu của tên ảnh (timestamp)
      const timestamp = urlImageObject.attacheditem_path
        .split('-')[0]
        .split('/')[3];
      return { ...urlImageObject, timestamp };
    });

    // Sắp xếp theo timestamp
    imagePathsWithTimestamps.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );

    // Trả về localUrlImages đã được sắp xếp
    return imagePathsWithTimestamps.map((item) => ({
      attacheditem_path: item.attacheditem_path,
      // Nếu bạn cần giữ lại các thuộc tính khác, có thể thêm chúng vào đây
      // Ví dụ: attached_items_id: item.attached_items_id, ...
    }));
  };

  const handleSortImagesCommentPath = (comments) => {
    //comment <=> localUrlImagesComment

    // Lặp qua từng comment
    return comments.map((comment) => {
      // Tạo mảng các đối tượng chứa attacheditem_path và phần đầu của tên ảnh
      let imagePathsWithTimestamps = comment.attached_items.map(
        (urlImageObject) => {
          // Tách phần đầu của tên ảnh (timestamp)
          const timestamp = urlImageObject.attacheditem_comment_path
            .split('-')[0]
            .split('/')[3];
          return { ...urlImageObject, timestamp };
        }
      );
      // Sắp xếp theo timestamp
      imagePathsWithTimestamps.sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
      );

      // Cập nhật attached_items đã được sắp xếp trong comment
      return {
        ...comment,
        attached_items: imagePathsWithTimestamps.map((item) => ({
          attached_items_comment_id: item.attached_items_comment_id,
          attacheditem_comment_path: item.attacheditem_comment_path,
          // Nếu bạn cần giữ lại các thuộc tính khác, có thể thêm chúng vào đây
          // Ví dụ: attached_items_id: item.attached_items_id, ...
        })),
      };
    });
  };

  const handleSortImages = (localUrlImages) => {
    // Tạo mảng các đối tượng chứa attacheditem_path và phần đầu của tên ảnh
    let imagePathsWithTimestamps = localUrlImages.map((urlImageObject) => {
      // Tách phần đầu của tên ảnh (timestamp)
      const timestamp = urlImageObject.attacheditem_path
        .split('-')[0]
        .split('/')[3];
      return { ...urlImageObject, timestamp };
    });

    // Sắp xếp theo timestamp
    imagePathsWithTimestamps.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );

    // Trả về localUrlImages đã được sắp xếp
    return imagePathsWithTimestamps.map((item) => ({
      attached_items_id: item.attached_items_id,
      attacheditem_path: item.attacheditem_path,
      attacheditem_type: item.attacheditem_type,
      content: item.content,
      created_at: item.created_at,
      deleteat: item.deleteat,
      is_deleted: item.is_deleted,
      post_id: item.post_id,
      updated_at: item.updated_at,
      user_id: item.user_id,
      access_range: item.access_range,
      // Nếu bạn cần giữ lại các thuộc tính khác, có thể thêm chúng vào đây
      // Ví dụ: attached_items_id: item.attached_items_id, ...
    }));
    // return imagePathsWithTimestamps.map((item) => item.urlImageObject);
  };

  const handleSortImagesComment = (comments) => {
    //comment <=> localUrlImagesComment

    // Lặp qua từng comment
    return comments.map((comment) => {
      // Tạo mảng các đối tượng chứa attacheditem_path và phần đầu của tên ảnh
      let imagePathsWithTimestamps = comment.attached_items.map(
        (urlImageObject) => {
          // Tách phần đầu của tên ảnh (timestamp)
          const timestamp = urlImageObject.attacheditem_comment_path
            .split('-')[0]
            .split('/')[3];
          return { ...urlImageObject, timestamp };
        }
      );

      // Sắp xếp theo timestamp
      imagePathsWithTimestamps.sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
      );

      // Cập nhật attached_items đã được sắp xếp trong comment
      return {
        ...comment,
        attached_items: imagePathsWithTimestamps.map((item) => ({
          attached_items_comment_id: item.attached_items_comment_id,
          attacheditem_comment_path: item.attacheditem_comment_path,
          comment_id: comment.comment_id, // Thêm comment_id vào đối tượng returned
        })),
      };
    });
  };

  //Get images of post by post id
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

  //truy vấn gộp, sau đó lấy ra và find => hiển thị
  const getImageUrlsCommentByPostId = async (post) => {
    try {
      const urlImageCommentListLocal = await axios.get(
        `${apiBaseUrl}/comments/post/${post.post_id}/images`
      );
      setLocalUrlImagesComment(urlImageCommentListLocal.data);
    } catch (error) {
      console.error('Error finding images url comments by post id', error);
    }
  };

  const sortedUrlImages = handleSortImages(localUrlImages);
  const sortedUrlImagesComment = handleSortImagesComment(localUrlImagesComment);

  //View image modal
  const handleOpenViewImageModal = (e) => {
    if (!isDragging) {
      e.preventDefault();
      setOpenViewImageModal(true);
      const imageSrc = e.target.src;
      if (imageSrc) {
        setImageChoseToView(imageSrc);
        if (imageChoseToView) {
          const imagePath =
            '/assets/images/' + imageChoseToView.split('/assets/images/')[1];
          const currentImage = sortedUrlImages.find(
            (img) => img.attacheditem_path === imagePath
          );

          if (currentImage) {
            setCurrentViewImage(currentImage);
          }
        }
      }
    }
  };

  //View image comment modal
  const handleOpenViewImageCommentModal = (e) => {
    if (!isDragging) {
      e.preventDefault();
      setOpenViewImageCommentModal(true);
      const imageSrc = e.target.src;
      if (imageSrc) {
        setImageChoseToViewComment(imageSrc);
        if (imageChoseToViewComment) {
          const imagePath =
            '/assets/commentsimages/' +
            imageChoseToViewComment.split('/assets/commentsimages/')[1];
          const currentImage = sortedUrlImagesComment.find(
            (img) => img.attacheditem_path === imagePath
          );
          if (currentImage) {
            setCurrentViewImageComment(currentImage);
          }
        }
      }
    }
  };

  // useEffect(() => {
  //   //Lấy images url của comments của post
  //   getImageUrlsCommentByPostId(chosenPost);
  //   console.log('chosenpot', chosenPost);
  // }, [chosenPost, openViewImageCommentModal]);

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
    if (viewPrevCommentImageRef.current && viewNextCommentImageRef.current) {
      if (sortedUrlImagesComment.length <= 1) {
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
    sortedUrlImagesComment,
  ]);

  useEffect(() => {
    //Xem imageChoseToView là cái nào, tìm index => set index hiện tại trở thành index của imageChoseToView và tiếp tục
    const currentImageChoseToView = sortedUrlImages.find(
      (image) => `${apiBaseUrl}` + image.attacheditem_path === imageChoseToView
    );

    setCurrentViewImageIndex(sortedUrlImages.indexOf(currentImageChoseToView));
  }, [imageChoseToView]);

  useEffect(() => {
    //Xem imageChoseToViewComment là cái nào, tìm index => set index hiện tại trở thành index của imageChoseToViewComment và tiếp tục
    const currentImageChoseToViewComment = sortedUrlImagesComment.find(
      (image) =>
        `${apiBaseUrl}` + image.attacheditem_comment_path ===
        imageChoseToViewComment
    );
    setCurrentViewImageCommentIndex(
      sortedUrlImagesComment.indexOf(currentImageChoseToViewComment)
    );
  }, [imageChoseToViewComment]);

  const handleViewPrevImage = () => {
    const prevIndex =
      (currentViewImageIndex - 1 + sortedUrlImages.length) %
      sortedUrlImages.length;
    setCurrentViewImageIndex(prevIndex);
    setImageChoseToView(
      `${apiBaseUrl}${sortedUrlImages[prevIndex]?.attacheditem_path}`
    );
  };

  const handleViewNextImage = () => {
    const nextIndex = (currentViewImageIndex + 1) % sortedUrlImages.length;
    setCurrentViewImageIndex(nextIndex);
    setImageChoseToView(
      `${apiBaseUrl}${sortedUrlImages[nextIndex]?.attacheditem_path}`
    );
  };

  const handleViewPrevCommentImage = () => {
    const prevIndex =
      (currentViewImageCommentIndex - 1 + sortedUrlImagesComment.length) %
      sortedUrlImagesComment.length;
    setCurrentViewImageCommentIndex(prevIndex);
    setImageChoseToViewComment(
      `${apiBaseUrl}${sortedUrlImagesComment[prevIndex]?.attacheditem_comment_path}`
    );
  };

  const handleViewNextCommentImage = () => {
    const nextIndex =
      (currentViewImageCommentIndex + 1) % sortedUrlImagesComment.length;
    setCurrentViewImageCommentIndex(nextIndex);
    setImageChoseToViewComment(
      `${apiBaseUrl}${sortedUrlImagesComment[nextIndex]?.attacheditem_comment_path}`
    );
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
      setImageUrlsList([]);
    }
  };

  //Editing
  const handleOpenEditingPost = () => {
    setIsEditing(true);
    setOpenOptionsModal(false);
    setOpenCommentOptionsModal(false);
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

  //Editing comment
  const handleEditingComment = async () => {
    if (commentForUpdate.length > 1000) {
      toast.error(
        'Chỉnh sửa không thành công. Nội dung bình luận không được vượt quá 1000 kí tự.'
      );
    } else {
      setIsEditingComment(true);
      try {
        await axios.patch(
          `${apiBaseUrl}/comments/update/${selectedCommentRemoveEdit.comment_id}`,
          {
            comment_content: commentForUpdate,
          }
        );
        setIsEditingComment(false);
        // // Cập nhật commentBeforeUpdate khi cập nhật thành công
        // //CommentBeforeUpdate lúc này sẽ giữ trạng thái ban đầu của comment khi chưa thay đổi
        // setCommentBeforeUpdate(commentForUpdate);
        toast.success('Chỉnh sửa bình luận thành công!');
      } catch (error) {
        console.error('Error editing comment', error);
        setIsEditingComment(false);
        toast.error('Chỉnh sửa bình luận không thành công. Vui lòng thử lại.');
      }
    }
  };

  //Click ra ngoài phạm vi của phần tử editing
  const handleInputBlur = () => {
    // setIsEditing(false);
    setContentForUpdate(contentEditableRef.current.innerText);
  };

  const handleInputBlurComment = () => {
    setCommentForUpdate(commentEditableRef.current.innerText);
  };

  const handleOpenEditingComment = () => {
    setIsEditingComment(true);
    setOpenOptionsModal(false);
    setOpenCommentOptionsModal(false);
  };

  const handleRemovePostWarning = () => {
    setOpenOptionsModal(false);
    setOpenCommentOptionsModal(false);
    setOpenDeleteModal(true);
    //disable editing if it opened
    setIsEditing(false);
  };

  const handleRemoveCommentWarning = () => {
    setOpenOptionsModal(false);
    setOpenCommentOptionsModal(false);
    setOpenDeleteCommentModal(true);
    //disable editing if it opened
    setIsEditingComment(false);
  };

  //Cancel editing post
  //Click "Không" when Modal opened
  const handleConfirmCancelEditingPost = () => {
    setOpenCancelEditingModal(true);
  };

  const handleConfirmCancelEditingComment = () => {
    setOpenCancelEditingCommentModal(true);
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

  const handleDefinitelyCancelEditingComment = () => {
    if (commentForUpdate !== commentBeforeUpdate) {
      //Có sự thay đổi comment so với ban đầu nhưng Huỷ - không tiếp tục chỉnh sửa
      //=> Giữ comment ban đầu
      setCommentForUpdate(commentBeforeUpdate);
    }
    setOpenCancelEditingCommentModal(false);
    setIsEditingComment(false);
  };

  //Post Comment Modal
  const handleClosePostCommentModal = (e) => {
    e.preventDefault();
    if (hasPostCommentContent || imageUrlsList.length !== 0) {
      setShowDiscardCommentModal(true);
    } else {
      setOpenAddCommentModal(false);
      setImageUrlsList([]);
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

  const handleClickPostNewComment = (e) => {
    if (e.target.value.trim()) {
      setHasPostCommentContent(true);
      console.log('change');
      setCommentContent(e.target.value.trim());
    } else {
      setHasPostCommentContent(false);
      console.log('not change');
      setCommentContent('');
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
    if (
      cancelViewPostImageRef.current &&
      cancelViewPostImageRef.current.contains(event.target)
    ) {
      setOpenViewImageModal(false);
    }
  };

  const handleClickOutsideImageViewCommentModal = (event) => {
    if (
      cancelViewCommentImageRef.current &&
      cancelViewCommentImageRef.current.contains(event.target)
    ) {
      setOpenViewImageCommentModal(false);
    }
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

  //Create post
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
      formData.append('user_id', '7634b4ee-e27e-4d03-8e61-d7d6d4459607'); //admin - chuyển thành thông tin của người đang đăng nhập nếu scale
      images.forEach((file) => {
        formData.append('images', file);
        console.log('Added image to formData:', file);
      });
      console.log('imagesurllist post', imageUrlsList);
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

  //Deleting comment
  const handleFinallyRemoveComment = async () => {
    try {
      await axios.patch(
        `${apiBaseUrl}/comments/delete/${selectedCommentRemoveEdit.comment_id}`
      );
      // setPostModal(false);
      // textareaRef.current.value = '';
      // setHasPostContent(false);
      setOpenDeleteCommentModal(false);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000); // Tự động reload sau 2 giây
      setIsSuccessFullyRemoved(true);
      getCommentsByPostId(chosenPost);
      toast.success('Xoá bình luận thành công!');
    } catch (error) {
      console.error('Error deleting comment', error);
      setOpenDeleteCommentModal(false);
      setIsSuccessFullyRemoved(false);
      toast.error('Xoá bình luận không thành công. Vui lòng thử lại.');
    }
  };

  //Create comment
  const handleCreateComment = async (post) => {
    console.log('imagesComment.length', imagesComment.length);
    if (commentContent.length > 1000) {
      toast.error(
        'Bình luận không thành công. Nội dung bình luận không được vượt quá 1000 kí tự.'
      );
    } else if (imagesComment.length > 10) {
      toast.error('Bình luận không thành công. Tối đa không quá 10 ảnh.');
    } else {
      const formData = new FormData();
      formData.append('post_id', post.post_id);
      formData.append('comment_content', commentContent);
      formData.append('user_id', '7634b4ee-e27e-4d03-8e61-d7d6d4459607'); //admin - chuyển thành thông tin của người đang đăng nhập nếu scale
      imagesComment.forEach((file) => {
        // ------------------------------WARNING-----------------------------------------
        //TÊN TRƯỜNG NÀY CẦN PHẢI TRÙNG KHỚP VỚI TÊN Ở commentRoutes
        //Cụ thể là:
        //       commentController.upload.array('imagesComment', 10),   (ĐÚNG)
        //Chứ không phải:
        //       commentController.upload.array('images', 10),   (SAI)
        formData.append('imagesComment', file);
      });

      try {
        await axios.post(`${apiBaseUrl}/comments/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setOpenAddCommentModal(false);
        textareaCommentRef.current.value = '';
        setHasPostCommentContent(false);
        toast.success('Bình luận thành công!');
        getCommentsByPostId(post);
        getImageUrlsCommentByPostId(post);
        setImageUrlsList([]);
        setImagesComment([]);
      } catch (error) {
        console.error('Error creating comment', error);
        setOpenAddCommentModal(false);
        toast.error('Bình luận không thành công. Vui lòng thử lại.');
      }
    }
  };

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
    const countRedundantCharacter =
      numberCharactersAllowed - contentForUpdate.length; //Số lượng kí tự dư thừa
    setRedundantEditingCharactersNumber(countRedundantCharacter);
  }, [contentForUpdate, redundantEditingCharactersNumber]);

  //Counting redundant editing comment characters number
  useEffect(() => {
    const countRedundantCommentCharacter =
      numberCharactersAllowed - commentForUpdate.length; //Số lượng kí tự dư thừa
    setRedundantEditingCommentCharactersNumber(countRedundantCommentCharacter);
  }, [commentForUpdate, redundantEditingCommentCharactersNumber]);

  useEffect(() => {
    if (selectedCommentRemoveEdit) {
      console.log('selected remove', selectedCommentRemoveEdit);
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
    console.log('isDragging', isDragging);
  }, [isDragging]);

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
        handleFileOfCommentChange,
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
        redundantCommentCharactersNumber,
        setRedundantCommentCharactersNumber,
        numberCharactersAllowed,
        isUser,
        setIsUser,
        isLoggedByAdmin,
        adminInfor,
        openViewImageModal,
        setOpenViewImageModal,
        handleOpenViewImageModal,
        imageChoseToViewRef,
        imageChoseToViewCommentRef,
        handleClickOutsideImageViewModal,
        handleClickOutsideImageViewCommentModal,
        imageChoseToView,
        setImageChoseToView,
        imageChoseToViewComment,
        setImageChoseToViewComment,
        decodeEntities,
        apiBaseUrl,
        handleSortImagesPath,
        cancelViewPostImageRef,
        cancelViewCommentImageRef,
        localUrlImages,
        setLocalUrlImages,
        getImageUrlsByPostId,
        getImageUrlsCommentByPostId,
        lengthOfViewPostImage,
        setLengthOfViewPostImage,
        viewPrevImageRef,
        viewNextImageRef,
        currentViewImageIndex,
        setCurrentViewImageIndex,
        currentViewImageCommentIndex,
        setCurrentViewImageCommentIndex,
        handleViewPrevImage,
        handleViewNextImage,
        commentsByPostId,
        setCommentsByPostId,
        getCommentsByPostId,
        chosenPost,
        setChosenPost,
        openAddCommentModal,
        setOpenAddCommentModal,
        hasPostCommentContent,
        setHasPostCommentContent,
        showdiscardCommentModal,
        setShowDiscardCommentModal,
        clickCancelCommentDiscard,
        setClickCancelCommentDiscard,
        discardComment,
        setDiscardComment,
        textareaCommentRef,
        imagesComment,
        setImagesComment,
        handleClosePostCommentModal,
        handleClickPostNewComment,
        handleCreateComment,
        handleClickAddCommentImageIcon,
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
        handleFinallyRemoveComment,
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
        openViewImageCommentModal,
        setOpenViewImageCommentModal,
        handleOpenViewImageCommentModal,
        viewPrevCommentImageRef,
        viewNextCommentImageRef,
        handleViewPrevCommentImage,
        handleViewNextCommentImage,
        handleSortImagesComment,
        handleSortImagesCommentPath,

        // notify,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
