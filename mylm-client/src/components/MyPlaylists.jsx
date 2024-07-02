import { BiPlus, BiPencil, BiFilter } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

function MyPlaylists() {
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
        <div className=' sm2:border-slate-300 sm2:rounded-3xl sm2:shadow sm2:shadow-gray-400 sm2:px-10 sm2:py-5 md:px-20 mx-3 md:mx-10 lg:mx-14 md:py-10 my-5 '>
          <div className='relative grid grid-cols-12 create-new-playlist mb-3 cursor-pointer rounded-xl bg-white hover:bg-slate-100 duration-300 ease-in-out'>
            <div className='col-span-1 flex items-center'>
              <button className=''>
                <BiPlus className='text-5xl' />
              </button>
            </div>
            <div className='absolute top-2 left-16 col-span-11 text-2xl my-auto tracking-wide'>
              Tạo playlist
            </div>
          </div>
          <hr className='mb-5' />
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
          </div>
        </div>
      </div>
    </>
  );
}

export default MyPlaylists;
