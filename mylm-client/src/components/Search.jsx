import { BiSearch } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import { BiPen, BiPencil } from 'react-icons/bi';

function Search() {
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
  return (
    <>
      <div className='wrapper my-3 relative'>
        <div className='flex items-center gap-2 rounded-full bg-white hover:bg-slate-100 duration-300 ease-in-out border border-slate-300 shadow shadow-slate-200 fixed z-[1000] right-10 bottom-10 sm2:right-20 sm2:bottom-8 md:right-3 md:bottom-4 xl:bottom-9 xl:right-14 cursor-pointer'>
          <div className='add-post-icon text-2xl p-3'>
            <BiPencil />
          </div>
        </div>
        <div className=' sm2:border-slate-300 sm2:rounded-3xl sm2:shadow sm2:shadow-gray-400 sm2:px-10 sm2:py-5 md:px-20 mx-3 md:mx-10 lg:mx-14 md:py-10 my-5 '>
          <div className=' search-input tracking-wide rounded-2xl leading-8 border border-slate-300 mb-6'>
            <div className='flex gap-2 px-4 py-2 rounded-2xl bg-slate-50'>
              <div className='my-auto text-2xl'>
                <BiSearch />
              </div>
              <input
                autoFocus
                className='bg-slate-50 w-full'
                type='text'
                placeholder='Search a post'
              />
            </div>
          </div>
          <div className='grid-search-results'>
            <div className='result-item grid relative mb-[85px]'>
              <div className='image-avatar absolute top-0 left-0'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='rounded-full w-12 h-12'
                />
              </div>
              <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                <div className='name-and-posted-at'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                  <div className='result-little-detail  whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    Đây là một trong những kỉ niệm mà tôi nhớ nhất trong đời. Dù
                    có trải qua bao nhiêu thăng trầm, tôi vẫn trân quý khoảng
                    thời gian đó và đôi lúc tôi vẫn tự nhắc nhở mình rằng không
                    được quên đi quá khứ. Bởi chính tôi trong quá khứ đã vượt
                    qua tất cả để có được tôi ở hiện tại
                  </div>
                </div>
              </div>
            </div>
            <hr className='mb-5' />

            <div className='result-item grid relative mb-[85px]'>
              <div className='image-avatar absolute top-0 left-0'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='rounded-full w-12 h-12'
                />
              </div>
              <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                <div className='name-and-posted-at'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                  <div className='result-little-detail  whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    Đây là một trong những kỉ niệm mà tôi nhớ nhất trong đời. Dù
                    có trải qua bao nhiêu thăng trầm, tôi vẫn trân quý khoảng
                    thời gian đó và đôi lúc tôi vẫn tự nhắc nhở mình rằng không
                    được quên đi quá khứ. Bởi chính tôi trong quá khứ đã vượt
                    qua tất cả để có được tôi ở hiện tại
                  </div>
                </div>
              </div>
            </div>
            <hr className='mb-5' />

            <div className='result-item grid relative mb-[85px]'>
              <div className='image-avatar absolute top-0 left-0'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='rounded-full w-12 h-12'
                />
              </div>
              <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                <div className='name-and-posted-at'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                  <div className='result-little-detail  whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    Đây là một trong những kỉ niệm mà tôi nhớ nhất trong đời. Dù
                    có trải qua bao nhiêu thăng trầm, tôi vẫn trân quý khoảng
                    thời gian đó và đôi lúc tôi vẫn tự nhắc nhở mình rằng không
                    được quên đi quá khứ. Bởi chính tôi trong quá khứ đã vượt
                    qua tất cả để có được tôi ở hiện tại
                  </div>
                </div>
              </div>
            </div>
            <hr className='mb-5' />

            <div className='result-item grid relative mb-[85px]'>
              <div className='image-avatar absolute top-0 left-0'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='rounded-full w-12 h-12'
                />
              </div>
              <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                <div className='name-and-posted-at'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                  <div className='result-little-detail  whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    Đây là một trong những kỉ niệm mà tôi nhớ nhất trong đời. Dù
                    có trải qua bao nhiêu thăng trầm, tôi vẫn trân quý khoảng
                    thời gian đó và đôi lúc tôi vẫn tự nhắc nhở mình rằng không
                    được quên đi quá khứ. Bởi chính tôi trong quá khứ đã vượt
                    qua tất cả để có được tôi ở hiện tại
                  </div>
                </div>
              </div>
            </div>
            <hr className='mb-5' />

            <div className='result-item grid relative mb-[85px]'>
              <div className='image-avatar absolute top-0 left-0'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='rounded-full w-12 h-12'
                />
              </div>
              <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                <div className='name-and-posted-at'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                  <div className='result-little-detail  whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    Đây là một trong những kỉ niệm mà tôi nhớ nhất trong đời. Dù
                    có trải qua bao nhiêu thăng trầm, tôi vẫn trân quý khoảng
                    thời gian đó và đôi lúc tôi vẫn tự nhắc nhở mình rằng không
                    được quên đi quá khứ. Bởi chính tôi trong quá khứ đã vượt
                    qua tất cả để có được tôi ở hiện tại
                  </div>
                </div>
              </div>
            </div>
            <hr className='mb-5' />

            <div className='result-item grid relative mb-[85px]'>
              <div className='image-avatar absolute top-0 left-0'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='rounded-full w-12 h-12'
                />
              </div>
              <div className='result-content absolute top-0 left-16 w-[80%] sm2:w-[88%]'>
                <div className='name-and-posted-at'>
                  <div className='font-semibold'>Luu Vu</div>
                  <div className='text-slate-700 opacity-70'>Posted at</div>
                  <div className='result-little-detail  whitespace-nowrap overflow-hidden overflow-ellipsis'>
                    Đây là một trong những kỉ niệm mà tôi nhớ nhất trong đời. Dù
                    có trải qua bao nhiêu thăng trầm, tôi vẫn trân quý khoảng
                    thời gian đó và đôi lúc tôi vẫn tự nhắc nhở mình rằng không
                    được quên đi quá khứ. Bởi chính tôi trong quá khứ đã vượt
                    qua tất cả để có được tôi ở hiện tại
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
