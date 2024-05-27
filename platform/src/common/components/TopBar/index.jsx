import { useState, useEffect } from 'react';
import SearchMdIcon from '@/icons/Common/search_md.svg';
import TopBarItem from './TopBarItem';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import MenuBarIcon from '@/icons/menu_bar';
import AirqoLogo from '@/icons/airqo_logo.svg';
import ExpandIcon from '@/icons/SideBar/expand.svg';
import Spinner from '@/components/Spinner';
import SettingsIcon from '@/icons/SideBar/SettingsIcon';
import UserIcon from '@/icons/Topbar/userIcon';
import {
  toggleSidebar,
  setToggleDrawer,
  setSidebar,
} from '@/lib/store/services/sideBar/SideBarSlice';
import LogoutUser from '@/core/utils/LogoutUser';

const TopBar = ({ topbarTitle, noBorderBottom }) => {
  // check if current route contains navPath
  const router = useRouter();
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const userInfo = useSelector((state) => state.login.userInfo);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const togglingDrawer = useSelector((state) => state.sidebar.toggleDrawer);

  const PlaceholderImage = `https://ui-avatars.com/api/?name=${userInfo.firstName[0]}+${userInfo.lastName[0]}&background=random`;

  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  const handleDropdown = (event) => {
    event.stopPropagation();
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setIsLoading(true);
    LogoutUser(dispatch, router);
    setIsLoading(false);
  };

  useEffect(() => {
    const hideDropdown = () => {
      setDropdownVisible(false);
    };

    if (dropdownVisible) {
      window.addEventListener('click', hideDropdown);
    }

    return () => {
      window.removeEventListener('click', hideDropdown);
    };
  }, [dropdownVisible]);

  const handleClick = (path) => (event) => {
    event.preventDefault();
    router.push(path);
  };

  const handleDrawer = (e) => {
    e.preventDefault();
    dispatch(setToggleDrawer(!togglingDrawer));
    dispatch(setSidebar(false));
  };

  return (
    <nav
      className={`bg-white sticky top-0 z-50 w-full px-6 lg:py-0 h-[76px] lg:px-16 ${
        !noBorderBottom && 'border-b-[1px] border-b-grey-750'
      }`}>
      <div className='flex justify-between items-center bg-white py-4'>
        {/* Logo */}
        <div className='block lg:hidden relative  z-10 w-full'>
          <AirqoLogo className=' w-[46.56px] h-8' />
        </div>

        {/* sidebar toggle */}
        <div className='font-medium hidden lg:block text-2xl text-neutral-light-800'>
          {isCollapsed ? (
            <button
              type='button'
              onClick={() => dispatch(toggleSidebar())}
              className='focus:outline-none relative -left-14'>
              <ExpandIcon className='inline-block mr-2' />
            </button>
          ) : null}
          {topbarTitle}
        </div>

        <div className='hidden lg:flex justify-end md:justify-between items-center'>
          <div className='flex w-auto'>
            {/* {isCurrentRoute ? null : <TopBarItem Icon={SearchMdIcon} />} */}
            <div className='relative'>
              <button
                data-cy='profile-btn'
                className='focus:outline-none'
                type='button'
                onClick={handleDropdown}>
                <TopBarItem Image={userInfo.profilePicture || PlaceholderImage} dropdown />
              </button>
              {dropdownVisible && (
                <div
                  data-cy='topbar-dropdown-menu'
                  onClick={handleDropdownClick}
                  className='dropdown-menu w-60 h-auto border border-gray-200 absolute z-50 bg-white mt-1 right-0 shadow-lg rounded-lg overflow-hidden'>
                  <div className='flex items-center space-x-4 p-2'>
                    <div className='relative'>
                      <img
                        className='w-10 h-10 rounded-full object-cover'
                        src={userInfo.profilePicture || PlaceholderImage}
                        alt=''
                      />
                      <span className='bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full'></span>
                    </div>
                    <div
                      className='font-medium dark:text-white'
                      style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                      <div
                        className='capitalize'
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '14ch',
                        }}>
                        {userInfo?.firstName + ' ' + userInfo?.lastName}
                      </div>

                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '21ch',
                        }}
                        className='text-xs text-gray-500 dark:text-gray-400 w-full'>
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                  <hr className='dropdown-divider border-b border-gray-200 dark:border-gray-700' />
                  <ul className='dropdown-list p-2'>
                    <li
                      onClick={handleClick('/settings')}
                      className='flex items-center text-gray-500 hover:text-gray-600 cursor-pointer p-2'>
                      <span className='mr-3'>
                        <UserIcon fill='#6F87A1' width={16} height={16} />
                      </span>
                      My profile
                    </li>
                    <li
                      onClick={handleClick('/settings')}
                      className='flex items-center text-gray-500 hover:text-gray-600 cursor-pointer p-2'>
                      <span className='mr-3'>
                        <SettingsIcon fill='#6F87A1' width={17} height={17} />
                      </span>
                      Settings
                    </li>
                  </ul>
                  <hr className='dropdown-divider border-b border-gray-200 dark:border-gray-700' />
                  <ul className='dropdown-list p-2'>
                    <li
                      onClick={handleLogout}
                      className='text-gray-500 hover:text-gray-600 cursor-pointer p-2'>
                      Log out
                      {isLoading && (
                        <span className='float-right'>
                          <Spinner width={20} height={20} />
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hamburger menu */}
        <button
          type='button'
          className='lg:hidden relative flex items-center justify-start z-10 w-auto focus:outline-none border border-gray-200 rounded-xl'
          onClick={handleDrawer}>
          <span className='p-2'>
            <MenuBarIcon />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
