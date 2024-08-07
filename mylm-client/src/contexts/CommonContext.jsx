import {
  createContext,
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

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

  const isScreenLessThan730Px = useMediaQuery({ query: '(max-width: 730px)' });

  const [viewPostDetails, setViewPostDetails] = useState(false);

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
  const scrollContainerPostRef = useRef(null);
  const scrollContainerPostCommonRef = useRef(null);
  const scrollContainerCommentImageRef = useRef([]);
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
  const postDetailsRef = useRef(null);
  const optionsModalRef = useRef(null);
  const commentOptionsModalRef = useRef(null);

  const [contentForUpdate, setContentForUpdate] = useState('');
  const [contentBeforeUpdate, setContentBeforeUpdate] = useState('');
  const [commentForUpdate, setCommentForUpdate] = useState('');
  const [commentBeforeUpdate, setCommentBeforeUpdate] = useState('');

  const [postsList, setPostsList] = useState([]);
  const [allMyPosts, setAllMyPosts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagesComment, setImagesComment] = useState([]);
  const [imageUrlsList, setImageUrlsList] = useState([]);
  const [adminInfor, setAdminInfor] = useState(null);
  const [currentUserInfor, setCurrentUserInfor] = useState(null);
  const [role, setRole] = useState(null);
  /*
  role chính: user, exceptional, admin
  */

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
  const [isDraggingPostImage, setIsDraggingPostImage] = useState(false);
  const [isDraggingPostCommonImage, setIsDraggingPostCommonImage] =
    useState(false);
  const [isDraggingCommentImage, setIsDraggingCommentImage] = useState(false);

  const [currentViewImageIndex, setCurrentViewImageIndex] = useState(null);
  const [currentViewImage, setCurrentViewImage] = useState(null);
  const [currentViewImageCommentIndex, setCurrentViewImageCommentIndex] =
    useState(null);
  const [currentViewImageComment, setCurrentViewImageComment] = useState(null);

  const [imagesOfCurrentCommentDragging, setImagesOfCurrentCommentDragging] =
    useState([]);
  const [
    mappedImagesOfCurrentCommentDragging,
    setMappedImagesOfCurrentCommentDragging,
  ] = useState([]);

  const [searchContent, setSearchContent] = useState('');

  const [commentsByPostId, setCommentsByPostId] = useState([]);
  const [openAddCommentModal, setOpenAddCommentModal] = useState(false);
  const [openOptionsModal, setOpenOptionsModal] = useState(false);
  const [openCommentOptionsModal, setOpenCommentOptionsModal] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteCommentModal, setOpenDeleteCommentModal] = useState(false);
  const [openCancelEditingModal, setOpenCancelEditingModal] = useState(false);
  const [openCancelEditingCommentModal, setOpenCancelEditingCommentModal] =
    useState(false);
  const [openEditUserInformationModal, setOpenEditUserInformationModal] =
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

  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || { from: '/' }; // Nếu không có thông tin from thì mặc định về trang chủ

  // const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_DEVELOPMENT;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_PRODUCTION;

  const currentLoggedIn =
    JSON.parse(localStorage.getItem('admin')) ||
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('exceptional'));

  useEffect(() => {
    if (viewPostDetails) {
      setViewPostDetails(false);
    }
  }, [location.pathname]);

  const getCommentsByPostId = async (post) => {
    if (post) {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/comments/post/${post.post_id}`
        );
        setCommentsByPostId(response.data);
      } catch (err) {
        console.log('Error when getting comments by post id', err);
      }
    }
    return;
  };

  // Function to decode HTML entities
  const decodeEntities = (encodedString) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  };

  //Chuyển chuỗi thành link - xử lý URL trước khi đưa vào database
  const convertTextToLinks = (text) => {
    // Biểu thức chính quy với nhóm bắt đầu
    const urlPattern = /(?:http[s]?:\/\/(?:www\.)?)\S+/gi;

    // Thay thế các URL bằng thẻ <a>
    return text.replace(
      urlPattern,
      (url) =>
        `<a href="${url}" class="vulv-custom-link-css" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  };

  const TextWithLinks = (text) => {
    const decodedText = decodeEntities(text);
    const formattedText = convertTextToLinks(decodedText);
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  // const inputText = "Đây là một URL: https://example.com và đây là một URL khác: http://example.org";
  // const formattedText = convertTextToLinks(inputText);

  const handleClickHeaderIcons = (e) => {
    const iconId = e.currentTarget.id;
    setHeaderIconsClicked(iconId);
  };

  const handleClickNavbarIcon = () => {
    setShowNavbarSlider(!showNavbarSlider);
  };

  const findAttachItemsByCommentIdAfterSorting = (comment) => {
    return (
      handleSortImagesCommentPath(localUrlImagesComment).find(
        (imageComment) => imageComment.comment_id === comment.comment_id
      )?.attached_items ?? []
    ); // Trả về một mảng trống nếu không tìm thấy attached_items
  };

  //Increase UX when scrolling
  const handleSwipePostImage = (e) => {
    e.preventDefault();
    const container = scrollContainerPostRef.current;

    if (container) {
      setIsDraggingPostImage(true);
      let startX = e.pageX - container.offsetLeft;
      let scrollLeft = container.scrollLeft;

      container.classList.add('grabbing');

      const onMouseMove = (e) => {
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        setIsDraggingPostImage(false);
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

  const handleSwipeCommentImage = (e, index, comment) => {
    console.log('current comment', comment);
    //thông tin 'comment' trên không chứa image path - chính xác hơn là attach_items
    //Vì vậy cần lấy được attach_items và gán vào
    //Mảng 'findAttachItemsByCommentIdAfterSorting(comment)' này chứa các image của 1 comment cụ thể
    setImagesOfCurrentCommentDragging(
      findAttachItemsByCommentIdAfterSorting(comment)
    );
    console.log('index of comment in this post', index);
    e.preventDefault();
    const container = scrollContainerCommentImageRef.current[index];

    if (container) {
      setIsDraggingCommentImage(true);
      let startX = e.pageX - container.offsetLeft;
      let scrollLeft = container.scrollLeft;

      container.classList.add('grabbing');

      const onMouseMove = (e) => {
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        setIsDraggingCommentImage(false);
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

  const handleSwipePostCommonImage = (e) => {
    e.preventDefault();
    const container = scrollContainerPostCommonRef.current;

    if (container) {
      setIsDraggingPostCommonImage(true);
      let startX = e.pageX - container.offsetLeft;
      let scrollLeft = container.scrollLeft;

      container.classList.add('grabbing');

      const onMouseMove = (e) => {
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        setIsDraggingPostCommonImage(false);
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

  //View post image modal
  const handleOpenViewImageModal = (e) => {
    if (!isDraggingPostImage) {
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
    if (!isDraggingCommentImage) {
      e.preventDefault();
      setOpenViewImageCommentModal(true);
      const imageSrc = e.target.src;
      if (imagesOfCurrentCommentDragging) {
        setImageChoseToViewComment(imageSrc);
        const imagePath =
          '/assets/commentsimages/' +
          imageSrc.split('/assets/commentsimages/')[1];
        const currentImage = imagesOfCurrentCommentDragging.find(
          (attach_items_element) =>
            attach_items_element.attacheditem_comment_path === imagePath
        );
        if (currentImage) {
          setCurrentViewImageComment(currentImage);
        }
      }
    }
  };

  const handleViewPrevImage = () => {
    const prevIndex =
      (currentViewImageIndex - 1 + sortedUrlImages.length) %
      sortedUrlImages.length;
    setCurrentViewImageIndex(prevIndex);
    const finalPath = sortedUrlImages[prevIndex]?.attacheditem_path.includes(
      'https://res.cloudinary.com/'
    )
      ? sortedUrlImages[prevIndex]?.attacheditem_path
      : `${apiBaseUrl}${sortedUrlImages[prevIndex]?.attacheditem_path}`;
    setImageChoseToView(finalPath);
  };

  const handleViewNextImage = () => {
    const nextIndex = (currentViewImageIndex + 1) % sortedUrlImages.length;
    setCurrentViewImageIndex(nextIndex);
    const finalPath = sortedUrlImages[nextIndex]?.attacheditem_path.includes(
      'https://res.cloudinary.com/'
    )
      ? sortedUrlImages[nextIndex]?.attacheditem_path
      : `${apiBaseUrl}${sortedUrlImages[nextIndex]?.attacheditem_path}`;
    setImageChoseToView(finalPath);
  };

  const handleViewPrevCommentImage = () => {
    if (currentViewImageCommentIndex < 0) {
      setCurrentViewImageCommentIndex(
        mappedImagesOfCurrentCommentDragging.length - 1
      );
    } else if (
      currentViewImageCommentIndex >=
      mappedImagesOfCurrentCommentDragging.length
    ) {
      setCurrentViewImageCommentIndex(0);
    } else {
      const prevIndex =
        (currentViewImageCommentIndex -
          1 +
          mappedImagesOfCurrentCommentDragging.length) %
        mappedImagesOfCurrentCommentDragging.length;
      setCurrentViewImageCommentIndex(prevIndex);
      const finalPath = mappedImagesOfCurrentCommentDragging[
        prevIndex
      ].includes('https://res.cloudinary.com/')
        ? mappedImagesOfCurrentCommentDragging[prevIndex]
        : `${apiBaseUrl}${mappedImagesOfCurrentCommentDragging[prevIndex]}`;
      setImageChoseToViewComment(finalPath);
    }
  };

  const handleViewNextCommentImage = () => {
    if (currentViewImageCommentIndex < 0) {
      setCurrentViewImageCommentIndex(
        mappedImagesOfCurrentCommentDragging.length - 1
      );
    } else if (
      currentViewImageCommentIndex >=
      mappedImagesOfCurrentCommentDragging.length
    ) {
      setCurrentViewImageCommentIndex(0);
    } else {
      const nextIndex =
        (currentViewImageCommentIndex + 1) %
        mappedImagesOfCurrentCommentDragging.length;
      setCurrentViewImageCommentIndex(nextIndex);
      const finalPath = mappedImagesOfCurrentCommentDragging[
        nextIndex
      ].includes('https://res.cloudinary.com/')
        ? mappedImagesOfCurrentCommentDragging[nextIndex]
        : `${apiBaseUrl}${mappedImagesOfCurrentCommentDragging[nextIndex]}`;
      setImageChoseToViewComment(finalPath);
    }
  };

  //Post Modal
  const handleOpenPostModal = () => {
    setPostModal(true);
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
    getCommentsByPostId(post);
    setViewPostDetails(true);
  };

  //Open options modal
  const handleSetOptionsModal = () => {
    setOpenOptionsModal(!openOptionsModal);
  };

  //Open comment options modal
  const handleSetCommentOptionsModal = (index, comment) => {
    setOpenCommentOptionsModal(index);
    setSelectedCommentRemoveEdit(comment);
  };

  //Editing
  const handleOpenEditingPost = () => {
    setIsEditing(true);
    setOpenOptionsModal(false);
    setOpenCommentOptionsModal(false);
    setIsEditingComment(false);
  };

  //Editing post
  const handleEditingPost = async () => {
    if (contentForUpdate.length > 1000) {
      toast.error(
        'Chỉnh sửa không thành công. Nội dung bài đăng không được vượt quá 1000 kí tự 😿.'
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
        toast.success('Chỉnh sửa bài thành công 😸!');
      } catch (error) {
        console.error('Error editing post', error);
        setIsEditing(false);
        toast.error('Chỉnh sửa bài không thành công. Vui lòng thử lại 😿.');
      }
    }
  };

  //Editing comment
  const handleEditingComment = async () => {
    if (commentForUpdate.length > 1000) {
      toast.error(
        'Chỉnh sửa không thành công. Nội dung bình luận không được vượt quá 1000 kí tự 😿.'
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
        toast.success('Chỉnh sửa bình luận thành công 😸!');
      } catch (error) {
        console.error('Error editing comment', error);
        setIsEditingComment(false);
        toast.error(
          'Chỉnh sửa bình luận không thành công. Vui lòng thử lại 😿.'
        );
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
    setIsEditing(false);
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
    console.log('clicked', openCancelEditingCommentModal);
    setOpenCancelEditingCommentModal(!openCancelEditingCommentModal);
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
      setPostContent(e.target.value.trim());
    } else {
      setHasPostContent(false);
      setPostContent('');
    }
  };

  const handleClickPostNewComment = (e) => {
    if (e.target.value.trim()) {
      setHasPostCommentContent(true);
      setCommentContent(e.target.value.trim());
    } else {
      setHasPostCommentContent(false);
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
      setCurrentViewImageCommentIndex(null);
    }
  };

  const getAllPostsOfAdmin = async () => {
    try {
      //Nếu không có người đăng nhập thì mặc định getAllPost của admin
      const response = await axios.get(`${apiBaseUrl}/posts/admin`);
      setPostsList(response.data);
    } catch (error) {
      console.error('Error getting all posts of admin', error);
    }
  };

  const getAllPostsExceptMe = async () => {
    try {
      //Nếu đăng nhập thì lấy post của mọi người trừ của currentRole
      const currentInfor =
        JSON.parse(localStorage.getItem('admin')) ||
        JSON.parse(localStorage.getItem('user')) ||
        JSON.parse(localStorage.getItem('exceptional'));
      const response = await axios.get(
        `${apiBaseUrl}/posts/except-me/${currentInfor.user_id}`
      );
      setPostsList(response.data);
    } catch (error) {
      console.error('Error getting all posts except me', error);
    }
  };

  const getAllMyPosts = async () => {
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
  };

  const getCurrentLoggedInUser = async (currentLoggedIn) => {
    try {
      // Lấy thông tin người dùng hiện tại
      const userResponse = await axios.get(
        `${apiBaseUrl}/users/current-logged-in-information?role=${currentLoggedIn.role}&userid=${currentLoggedIn.user_id}`
      );
      setCurrentUserInfor(userResponse.data[0]);

      // Lấy các bài viết ngoại trừ của người dùng hiện tại
      const postsResponse = await axios.get(
        `${apiBaseUrl}/posts/except-me/${currentLoggedIn.user_id}`
      );
      setPostsList(postsResponse.data);
    } catch (err) {
      console.log('Error when getting data', err);
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

  //Get lastest - newest post
  const getLastestPostCreatedByMe = async (currentUserInfor) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/posts/my-lastest-post/${currentUserInfor.user_id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting lastest post', error);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    // https://api.cloudinary.com/v1_1/demo/image/upload
    const url = 'https://api.cloudinary.com/v1_1/dgzkbbqjx/image/upload';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_lasting_memories_2307_images'); // Thay đổi với upload_preset của bạn
    // formData.append('folder', 'images'); // Thay đổi với upload_preset của bạn

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful');
      console.log('response.data.url', response.data.url);
      console.log('response.data', response.data);
      return response.data.secure_url; //ok
    } catch (error) {
      console.error(
        'Error uploading to Cloudinary',
        error.response ? error.response.data : error.message
      );
      throw new Error('Upload to Cloudinary failed');
    }
  };

  const uploadImageCommentsToCloudinary = async (file) => {
    // https://api.cloudinary.com/v1_1/demo/image/upload
    const url = 'https://api.cloudinary.com/v1_1/dgzkbbqjx/image/upload';

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      'my_lasting_memories_2307_comments_images'
    );
    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful');
      console.log('response.data.url', response.data.url);
      console.log('response.data', response.data);
      return response.data.secure_url; //ok
    } catch (error) {
      console.error(
        'Error uploading comments image to Cloudinary',
        error.response ? error.response.data : error.message
      );
      throw new Error('Upload comments image to Cloudinary failed');
    }
  };

  //Create post
  const handleCreatePost = async () => {
    console.log('images.length', images.length);
    if (postContent.length > 1000) {
      toast.error(
        'Đăng bài không thành công. Nội dung bài đăng không được vượt quá 1000 kí tự 😿.'
      );
      return;
    }

    if (images.length > 10) {
      toast.error('Đăng bài không thành công. Tối đa không quá 10 ảnh 😿.');
      return;
    }

    try {
      // Tải ảnh lên Cloudinary
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const url = await uploadImageToCloudinary(file);
          return url;
        })
      );
      console.log('imageurlsall', imageUrls);

      const postData = {
        content: postContent,
        user_id: currentUserInfor.user_id,
        images_array: JSON.stringify(imageUrls), // Chuyển mảng ảnh thành chuỗi JSON
      };

      await axios.post(`${apiBaseUrl}/posts/createpost`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setPostModal(false);
      textareaRef.current.value = '';
      setHasPostContent(false);
      getAllPostsExceptMe();
      getAllMyPosts();
      setImageUrlsList([]);
      setImages([]);
      console.log('current', currentUserInfor);
      // const lastestPost = await getLastestPostCreatedByMe(currentUserInfor);
      toast.success(
        <div>
          Đăng bài thành công 😸! Hãy xem bài viết mới nhất của bạn tại
          <div
            onClick={() => {
              setHeaderIconsClicked('header-icon-profile');
              navigate('/profile');
            }}
            className='cursor-pointer hover:text-blue-500 text-blue-400 ease-in-out duration-300'
          >
            trang cá nhân
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error creating post', error);
      setPostModal(false);
      toast.error('Đăng bài không thành công. Vui lòng thử lại 😿.');
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
      toast.success('Xoá bài thành công 😸!');
      console.log('pho rom 1', from);
      setViewPostDetails(false);
      navigate(from); // Điều hướng về trang trước khi đến PostDetails
      getAllPostsExceptMe();
      getAllMyPosts();
    } catch (error) {
      console.error('Error deleting post', error);
      setOpenDeleteModal(false);
      toast.error('Xoá bài không thành công. Vui lòng thử lại 😿.');
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
      toast.success('Xoá bình luận thành công 😸!');
    } catch (error) {
      console.error('Error deleting comment', error);
      setOpenDeleteCommentModal(false);
      setIsSuccessFullyRemoved(false);
      toast.error('Xoá bình luận không thành công. Vui lòng thử lại 😿.');
    }
  };

  //Create comment
  const handleCreateComment = async (post) => {
    console.log('imagesComment.length', imagesComment.length);
    if (commentContent.length > 1000) {
      toast.error(
        'Bình luận không thành công. Nội dung bình luận không được vượt quá 1000 kí tự 😿.'
      );
    } else if (imagesComment.length > 10) {
      toast.error('Bình luận không thành công. Tối đa không quá 10 ảnh 😿.');
    } else {
      // const formData = new FormData();
      // formData.append('post_id', post.post_id);
      // formData.append('comment_content', commentContent);
      // // formData.append('user_id', '7634b4ee-e27e-4d03-8e61-d7d6d4459607'); //admin - chuyển thành thông tin của người đang đăng nhập nếu scale
      // formData.append('user_id', currentUserInfor.user_id); //admin - chuyển thành thông tin của người đang đăng nhập nếu scale
      // imagesComment.forEach((file) => {
      //   // ------------------------------WARNING-----------------------------------------
      //   //TÊN TRƯỜNG NÀY CẦN PHẢI TRÙNG KHỚP VỚI TÊN Ở commentRoutes
      //   //Cụ thể là:
      //   //       commentController.upload.array('imagesComment', 10),   (ĐÚNG)
      //   //Chứ không phải:
      //   //       commentController.upload.array('images', 10),   (SAI)
      //   formData.append('imagesComment', file);
      // });

      try {
        // Tải ảnh lên Cloudinary
        const imageCommentsUrls = await Promise.all(
          imagesComment.map(async (file) => {
            const url = await uploadImageCommentsToCloudinary(file);
            return url;
          })
        );

        const commentData = {
          content: commentContent,
          post_id: post.post_id,
          user_id: currentUserInfor.user_id,
          images_array: JSON.stringify(imageCommentsUrls), // Chuyển mảng ảnh thành chuỗi JSON
        };

        await axios.post(`${apiBaseUrl}/comments/create`, commentData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setOpenAddCommentModal(false);
        textareaCommentRef.current.value = '';
        setHasPostCommentContent(false);
        toast.success('Bình luận thành công 😸!');
        getCommentsByPostId(post);
        getImageUrlsCommentByPostId(post);
        setImageUrlsList([]);
        setImagesComment([]);
      } catch (error) {
        console.error('Error creating comment', error);
        setOpenAddCommentModal(false);
        toast.error('Bình luận không thành công. Vui lòng thử lại 😿.');
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
        scrollContainerPostRef,
        scrollContainerPostCommonRef,
        scrollContainerCommentImageRef,
        images,
        setImages,
        imageUrlsList,
        setImageUrlsList,
        handleSwipePostImage,
        handleSwipeCommentImage,
        handleSwipePostCommonImage,
        getAllUsers,
        getAllPostsOfAdmin,
        getAllPostsExceptMe,
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
        adminInfor,
        setAdminInfor,
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
        TextWithLinks,
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
        currentViewImage,
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
        findAttachItemsByCommentIdAfterSorting,
        imagesOfCurrentCommentDragging,
        setImagesOfCurrentCommentDragging,
        role,
        setRole,
        currentUserInfor,
        setCurrentUserInfor,
        postsList,
        setPostsList,
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
        sortedUrlImages,
        setMappedImagesOfCurrentCommentDragging,
        currentViewImageComment,
        mappedImagesOfCurrentCommentDragging,
        sortedUrlImagesComment,
        searchContent,
        setSearchContent,
        openEditUserInformationModal,
        setOpenEditUserInformationModal,
        getCurrentLoggedInUser,
        currentLoggedIn,
        // notify,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
