import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BiHome,
  BiSolidSearch,
  BiSearch,
  BiBell,
  BiSolidBellRing,
  BiSolidPlaylist,
  BiBookmark,
  BiSolidBookmark,
  BiMessage,
  BiMenu,
  BiPlus,
  BiNews,
  BiAddToQueue,
  BiCommentAdd,
  BiPlusCircle,
} from 'react-icons/bi';
import { AiFillBell, AiFillHome } from 'react-icons/ai';

function HomePage() {
  const [headerIconsClicked, setHeaderIconsClicked] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkRememberMeSession = async () => {
  //     try {
  //       await axios({
  //         method: 'post',
  //         url: 'http://127.0.0.1:3000/users/checkrememberme',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error logging in:', error);
  //       // Xử lý lỗi khi đăng nhập
  //       // setErrorMessage(error.response.data.message || 'Logging failed'); //lấy response từ server hiển thị lỗi cho user
  //     }
  //   };
  //   checkRememberMeSession();
  // });
  const handleClickHeaderIcons = (e) => {
    const iconId = e.currentTarget.id;
    setHeaderIconsClicked(iconId);
  };

  useEffect(() => {
    const iconClicked = document.getElementById(headerIconsClicked);
    //thêm classList để focus vào icon đang được chọn

    //Truy xuất toàn bộ các element có class cùng tên 'left-sidebar-icons'
    const allHeaderIcons = Array.from(
      document.querySelectorAll('.left-sidebar-icons')
    );
    //Lọc ra các element không phải element (icon) được clicked
    const unclickedHeaderIcons = allHeaderIcons.filter(
      (icon) => icon.id !== iconClicked
    );
    //Lặp qua các unclicked element đó và unfocus
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
      if (e.hasChildNodes()) {
        const childElements = e.children;
        // Kiểm tra số lượng phần tử con
        if (childElements[1]) {
          childElements[0].classList.add('block');
          childElements[0].classList.remove('hidden');
          childElements[1].classList.add('hidden');
        }
      }
    });
    //focus vào clicked element sau khi đã unfocus các element còn lại
    if (iconClicked) {
      // Thêm classList để focus vào icon đang được chọn
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
      //Nếu icon nào có icon khác (thay vì chỉ có 1 icon như mặc định) thì hiển thị icon đó
      if (iconClicked.hasChildNodes()) {
        const childElements = iconClicked.children;
        // Kiểm tra số lượng phần tử con
        if (childElements[1]) {
          childElements[0].classList.add('hidden');
          childElements[0].classList.remove('block');
          childElements[1].classList.add('block');
          childElements[1].classList.remove('hidden');
        }
      }
    }
  }, [headerIconsClicked]);

  return (
    <>
      {/* With authorization
        Check Remember Me có tồn tại không - khi vào homepage luôn mà không login
        Tức là khi vào homepage mà có thông tin đăng nhập thì chuyển thành session của user đã đăng nhập
        Ngược lại có thể để homepage mặc định, hoặc navigate về trang login
      */}
      <div className='container w-[95%] max-w-screen-xl mx-auto'>
        <div className='main-content flex flex-col lg:flex-row m-4'>
          <div className='max-w-screen-xl lg:max-w-[300px]'>
            <div className='left-sidebar flex flex-row lg:flex-col my-3'>
              <h5 className='MyLM font-semibold text-4xl mx-auto'>MyLM</h5>
              <div className='left-sidebar-icons-wrapper mx-auto'>
                <div className='flex sm2:hidden justify-center items-center text-3xl'>
                  <BiMenu />
                </div>
                <div
                  id='header-icon-bi-home'
                  className='left-sidebar-icons'
                  onClick={(e) => handleClickHeaderIcons(e)}
                >
                  <BiHome
                    id='header-icon-bi-home-before'
                    className='header-icons-common'
                  />
                  <AiFillHome id='header-icon-bi-home-after' />
                </div>
                <div
                  id='header-icon-bi-search'
                  className='left-sidebar-icons'
                  onClick={(e) => handleClickHeaderIcons(e)}
                >
                  <BiSearch id='header-icon-bi-search-before' />
                  <BiSolidSearch id='header-icon-bi-search-after' />
                </div>
                <div
                  id='header-icon-bi-bell'
                  className='left-sidebar-icons'
                  onClick={(e) => handleClickHeaderIcons(e)}
                >
                  <BiBell id='header-icon-bi-bell-before' />
                  <AiFillBell id='header-icon-bi-bell-after' />
                  {/* <BiSolidBellRing /> */}
                </div>
                <div
                  id='header-icon-bi-playlist'
                  className='left-sidebar-icons'
                  onClick={(e) => handleClickHeaderIcons(e)}
                >
                  <BiSolidPlaylist />
                </div>
                <div
                  id='header-icon-bi-bookmark'
                  className='left-sidebar-icons'
                  onClick={(e) => handleClickHeaderIcons(e)}
                >
                  <BiBookmark id='header-icon-bi-bookmark-before' />
                  <BiSolidBookmark id='header-icon-bi-bookmark-before' />
                </div>
                <div
                  id='header-icon-bi-message'
                  className='left-sidebar-icons'
                  onClick={(e) => handleClickHeaderIcons(e)}
                >
                  <BiMessage />
                </div>
              </div>
            </div>
          </div>
          <div className='header-feedscontent my-3'>
            <div className='header hidden lg:block'>
              <nav>
                <ul className='header-nav max-w-4xl mx-auto flex flex-row gap-7 justify-center pb-3'>
                  <li className='hover-header-nav'>Home</li>
                  <li className='hover-header-nav'>Search</li>
                  <li className='hover-header-nav'>Notifications</li>
                  <li className='hover-header-nav'>My playlists</li>
                  <li className='hover-header-nav'>Saved posts</li>
                  <li className='hover-header-nav'>Messages</li>
                </ul>
              </nav>
            </div>
            <div className='feeds-content border-slate-300 rounded-3xl shadow shadow-gray-400 px-10 md:px-20 mx-10 md:mx-14 py-5 md:py-10 my-5'>
              <div className='feeds-content-posts-of-myself flex flex-row justify-between gap-3'>
                <img
                  src='201587.jpg'
                  alt=''
                  className='my-avatar basis-1/7 max-w-[50px] h-[50px] my-auto rounded-full bg-cover bg-no-repeat bg-center'
                />
                <input
                  className='post-input basis-[80%] hidden sm2:block'
                  type='text'
                  placeholder='Speak your mind...'
                />
                <button className='post-button hidden sm2:block basis-1/7 font-semibold px-4 py-2 my-auto border-slate-300 rounded-xl shadow shadow-slate-300'>
                  Post
                </button>
                <div className='basis-1/7 text-4xl my-auto block sm2:hidden cursor-pointer'>
                  <BiPlusCircle />
                </div>
              </div>
              <hr className='my-3 border-slate-300' />

              <div className=''>
                <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
                  <img
                    src='201587.jpg'
                    alt=''
                    className='max-w-[50px] h-[50px] rounded-full'
                  />
                  <div className=''>
                    <div className='information-and-posttime'>
                      <div className=''>Information</div>
                      <div className=''>Posted at</div>
                    </div>
                  </div>
                </div>

                <div className='feeds-content-bottom-description flex flex-col'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dolore perspiciatis rem molestiae et officia cupiditate. Velit
                  ullam eum optio unde quo, dicta necessitatibus itaque enim
                  nisi veniam aperiam, incidunt a.
                </div>
              </div>
              <hr className='my-3 border-slate-300' />

              <div className=''>
                <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
                  <img
                    src='201587.jpg'
                    alt=''
                    className='max-w-[50px] h-[50px] rounded-full'
                  />
                  <div className=''>
                    <div className='information-and-posttime'>
                      <div className=''>Information</div>
                      <div className=''>Posted at</div>
                    </div>
                  </div>
                </div>

                <div className='feeds-content-bottom-description flex flex-col'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dolore perspiciatis rem molestiae et officia cupiditate. Velit
                  ullam eum optio unde quo, dicta necessitatibus itaque enim
                  nisi veniam aperiam, incidunt a.
                </div>
              </div>
              <hr className='my-3 border-slate-300' />

              <div className=''>
                <div className='feeds-content-top-about flex flex-row gap-3 mb-3'>
                  <img
                    src='201587.jpg'
                    alt=''
                    className='max-w-[50px] h-[50px] rounded-full'
                  />
                  <div className=''>
                    <div className='information-and-posttime'>
                      <div className=''>Information</div>
                      <div className=''>Posted at</div>
                    </div>
                  </div>
                </div>

                <div className='feeds-content-bottom-description flex flex-col'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dolore perspiciatis rem molestiae et officia cupiditate. Velit
                  ullam eum optio unde quo, dicta necessitatibus itaque enim
                  nisi veniam aperiam, incidunt a.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
