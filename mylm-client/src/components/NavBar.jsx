import { Link } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
function NavBar() {
  return (
    <nav className='navbar text-[18px]'>
      <ul className='drop-down'>
        {/* <li className='nav-link flex justify-end items-center text-3xl w-[86%]'>
          <BiMenu />
        </li> */}
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/'}>
            Home
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/search'}>
            Search
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/notifications'}>
            Notifications
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/myplaylists'}>
            My playlists
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/savedposts'}>
            Saved posts
          </Link>
        </li>
        <li className='nav-link-routing'>
          <Link className='nav-link-dropdown' to={'/messages'}>
            Messages
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
