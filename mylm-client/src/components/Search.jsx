import { BiSearch } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import { BiPen, BiPencil } from 'react-icons/bi';
import axios from 'axios';

function Search() {
  const [searchContent, setSearchContent] = useState('');
  const [postsResult, setPostsResult] = useState([]);

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

  const handleClick = () => {
    console.log('click');
  };

  useEffect(() => {
    const handleSearchPostsByContent = async () => {
      try {
        const response = await axios.post(
          'http://127.0.0.1:3000/posts/bycontent',
          {
            content: searchContent,
          }
        );
        setPostsResult(response.data);
      } catch (error) {
        console.error('Error finding post', error);
      }
    };
    handleSearchPostsByContent();
    console.log(postsResult);
  }, [searchContent]);

  useEffect(() => {
    const sectionPostedItems = document.querySelectorAll('.result-item');
    sectionPostedItems.forEach((section) => observer.observe(section));

    return () => {
      sectionPostedItems.forEach((section) => observer.unobserve(section));
    };
  }, []);
  return (
    <>
      <div className='wrapper my-3 relative'>
        <div className=' sm2:border-slate-300 sm2:rounded-3xl sm2:shadow sm2:shadow-gray-400 sm2:px-10 sm2:py-5 md:px-20 mx-3 md:mx-10 lg:mx-14 md:py-10 my-5 '>
          <div className=' search-input tracking-wide rounded-2xl leading-8 border border-slate-300 mb-6'>
            <div className='flex gap-2 px-4 py-2 rounded-2xl bg-slate-50'>
              <div className='my-auto text-2xl'>
                <BiSearch />
              </div>
              <input
                onChange={(e) => setSearchContent(e.target.value)}
                autoFocus
                className='bg-slate-50 w-full'
                type='text'
                placeholder='Search a post'
              />
            </div>
          </div>
          <div className='grid-search-results'>
            {searchContent && (
              <div className='mb-[85px]'>
                {postsResult.map((post, index) => (
                  <div
                    onClick={handleClick}
                    key={index}
                    className='result-item grid relative mb-4 cursor-pointer hover:bg-slate-700'
                  >
                    <div className=''>
                      <div className='image-avatar absolute top-0 left-0'>
                        <img
                          src='201587.jpg'
                          alt=''
                          className='rounded-full w-12 h-12'
                        />
                      </div>
                      <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                        <div className='name-and-posted-at'>
                          <div className='font-semibold'>{}</div>
                          <div className='text-slate-700 opacity-70'>
                            {post.created_at}
                          </div>
                          <div className='result-little-detail whitespace-nowrap overflow-hidden overflow-ellipsis'>
                            {post.content}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index !== postsResult.length - 1 && (
                      <hr className='mt-16' />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
