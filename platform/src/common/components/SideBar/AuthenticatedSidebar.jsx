import React, { useState, useEffect, useRef } from 'react';
import CollapseIcon from '@/icons/SideBar/Collapse.svg';
import { useWindowSize } from '@/lib/windowSize';
import SideBarItem, { SideBarDropdownItem, SidebarIconItem } from './SideBarItem';
import AirqoLogo from '@/icons/airqo_logo.svg';
import CloseIcon from '@/icons/close_icon';
import WorldIcon from '@/icons/SideBar/world_Icon';
import HomeIcon from '@/icons/SideBar/HomeIcon';
import SettingsIcon from '@/icons/SideBar/SettingsIcon';
import BarChartIcon from '@/icons/SideBar/BarChartIcon';
import CollocateIcon from '@/icons/SideBar/CollocateIcon';
import OrganizationDropdown from '../Dropdowns/OrganizationDropdown';
import { checkAccess } from '@/core/utils/protectedRoute';
import CollapsedSidebar from './CollapsedSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '@/lib/store/services/sideBar/SideBarSlice';

const AuthenticatedSideBar = ({ toggleDrawer, setToggleDrawer }) => {
  const dispatch = useDispatch();
  const sideBarDisplayStyle = toggleDrawer ? 'flex fixed left-0 z-50' : 'hidden';
  const size = useWindowSize();
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

  // Toggle Dropdown open and close
  const [collocationOpen, setCollocationOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Create a ref for the sidebar
  const sidebarRef = useRef();

  useEffect(() => {
    const collocationOpenState = localStorage.getItem('collocationOpen');
    const analyticsOpenState = localStorage.getItem('analyticsOpen');

    if (collocationOpenState) {
      setCollocationOpen(JSON.parse(collocationOpenState));
    }

    if (analyticsOpenState) {
      setAnalyticsOpen(JSON.parse(analyticsOpenState));
    }
  }, []);

  // local storage
  useEffect(() => {
    localStorage.setItem('collocationOpen', JSON.stringify(collocationOpen));
    localStorage.setItem('analyticsOpen', JSON.stringify(analyticsOpen));
  }, [collocationOpen, analyticsOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setToggleDrawer(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  return !isCollapsed ? (
    <div className='w-64' ref={sidebarRef}>
      <div
        className={`${
          size.width >= 1024 ? 'flex' : sideBarDisplayStyle
        } bg-white h-[calc(100vh)] lg:relative flex-col justify-between overflow-y-auto border-t-0 border-r-[1px] border-r-grey-750 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-200`}>
        <div>
          <div className='p-4 justify-between items-center flex'>
            <AirqoLogo className='w-[46.56px] h-8 flex flex-col flex-1' />
            <button type='button' onClick={() => dispatch(toggleSidebar())}>
              <CollapseIcon className='invisible md:invisible lg:visible pt-1 h-full flex flex-col flex-3' />
            </button>
            <button
              type='button'
              className='lg:hidden relative flex items-center justify-end z-10 w-auto focus:outline-none border border-gray-200 rounded-md'
              onClick={() => setToggleDrawer(!toggleDrawer)}>
              <CloseIcon />
            </button>
          </div>
          <div className='mt-7 mx-4'>
            <OrganizationDropdown />
          </div>
          <div className='mt-11 mx-2'>
            <SideBarItem label='Home' Icon={HomeIcon} navPath='/Home' />
            <SideBarItem label='Analytics' Icon={BarChartIcon} navPath='/analytics' />
            {checkAccess('CREATE_UPDATE_AND_DELETE_NETWORK_DEVICES') && (
              <SideBarItem
                label='Collocation'
                Icon={CollocateIcon}
                dropdown
                toggleMethod={() => setCollocationOpen(!collocationOpen)}
                toggleState={collocationOpen}>
                <SideBarDropdownItem itemLabel='Overview' itemPath='/collocation/overview' />
                <SideBarDropdownItem itemLabel='Collocate' itemPath='/collocation/collocate' />
              </SideBarItem>
            )}
            <SideBarItem label='AirQo map' Icon={WorldIcon} navPath='/map' />
          </div>
        </div>
        <div className='mx-2 mb-3'>
          <SideBarItem label='Settings' Icon={SettingsIcon} navPath={'/settings'} />
        </div>
      </div>
    </div>
  ) : (
    <CollapsedSidebar />
  );
};

export default AuthenticatedSideBar;
