import { Link } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
import { useCommon } from '../contexts/CommonContext';

function NavBar() {
  const { isUser } = useCommon();

  return (
    <nav className='navbar text-[16px]'>
      <ul className='drop-down'>
        {/* <li className='nav-link flex justify-end items-center text-3xl w-[86%]'>
          <BiMenu />
        </li> */}
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/'}>
            Trang chủ
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/search'}>
            Tìm kiếm
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/notifications'}>
            Thông báo
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/myplaylists'}>
            Danh sách nhạc
          </Link>
        </li>
        {isUser === false ? (
          <li className='nav-link-routing'>
            <Link className='nav-link-dropdown' to={'/savedposts'}>
              Bài viết đã lưu
            </Link>
          </li>
        ) : (
          ''
        )}
        {isUser === false ? (
          <li className='nav-link-routing'>
            <Link className='nav-link-dropdown' to={'/messages'}>
              Tin nhắn
            </Link>
          </li>
        ) : (
          ''
        )}
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/profile'}>
            Về tác giả
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
