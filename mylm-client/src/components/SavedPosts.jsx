import { BiPencil, BiFilter } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useCommon } from '../contexts/CommonContext';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
function SavedPosts() {
  const {
    adminInfor,
    apiBaseUrl,
    role,
    setRole,
    currentUserInfor,
    setCurrentUserInfor,
    mySavedPostList,
    setMySavedPostList,
    handleViewPostDetails,
    getAuthorAvatarByUserId,
    getAuthorNameOfPostByUserId,
    getPostedTime,
    viewPostDetails,
    getImageUrlsCommentByPostId,
    setChosenPost,
    chosenPost,
  } = useCommon();

  const navigate = useNavigate();
  const location = useLocation();

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

  const getAllMySavedPosts = async () => {
    if (currentUserInfor) {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/posts/saved-post/my-all-saved-posts/${currentUserInfor.user_id}`
        );
        setMySavedPostList(response.data);
      } catch (error) {
        console.error('Error fetching all my saved post by user id', error);
      }
    }
  };

  useEffect(() => {
    getAllMySavedPosts();
  }, []);

  useEffect(() => {
    if (!viewPostDetails) {
      setChosenPost(null);
    } else {
      getImageUrlsCommentByPostId(chosenPost);
      navigate('/post-details', { state: { from: location.pathname } });
    }
  }, [viewPostDetails]);

  return (
    <>
      <div className='wrapper my-3 relative'>
        <div className=' sm2:border-slate-300 sm2:rounded-3xl sm2:shadow sm2:shadow-gray-400 sm2:px-10 sm2:py-5 md:px-20 mx-3 md:mx-10 lg:mx-14 md:py-10 my-5 '>
          {/* List of saved post */}
          <div className='list-of-saved-posts'>
            {mySavedPostList.length > 0 ? (
              mySavedPostList.map((post, index) =>
                index === 0 ? (
                  <div
                    onClick={() => handleViewPostDetails(post)}
                    key={post.post_id}
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
                            {getAuthorNameOfPostByUserId(post.author_user_id)}
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
                      {index !== mySavedPostList.length - 1 ? (
                        <div className='absolute top-[75px] sm2:top-[85px] bg-slate-300 font-thin w-full h-[0.2px]'></div>
                      ) : (
                        <div className='absolute top-[75px] sm2:top-[85px] bg-white w-full h-[0.2px]'></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleViewPostDetails(post)}
                    key={post.post_id}
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
                            {getAuthorNameOfPostByUserId(post.author_user_id)}
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
                      {index !== mySavedPostList.length - 1 ? (
                        <div className='absolute top-[75px] sm2:top-[85px] bg-slate-300 font-thin w-full h-[0.2px]'></div>
                      ) : (
                        <div className='absolute top-[75px] sm2:top-[85px] bg-white w-full h-[0.2px]'></div>
                      )}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className='text-center text-lg font-semibold'>
                Bạn chưa lưu bài viết nào
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SavedPosts;
