import Link from 'next/link';
import ArrowDropDownIcon from '@/icons/arrow_drop_down';
import { theme } from '../../../../tailwind.config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const SideBarDropdownItem = ({ itemLabel, itemPath }) => {
  const router = useRouter();
  const [isMediumDevice, setIsMediumDevice] = useState(false);
  // get current route
  const currentRoute = router.pathname;
  // check if current route contains navPath
  const isCurrentRoute = currentRoute.includes(itemPath);

  const changePath = (e) => {
    e.preventDefault();
    router.push(itemPath);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaQueryChange = (e) => {
      setIsMediumDevice(e.matches);
    };

    setIsMediumDevice(mediaQuery.matches);
    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  return (
    <a href={itemPath} onClick={changePath}>
      <span
        className={`h-10 pl-12 flex items-center ${
          itemPath
            ? 'hover:bg-light-blue hover:text-blue'
            : 'hover:bg-grey-900 hover:opacity-50 hover:cursor-not-allowed'
        }`}
      >
        {(!isMediumDevice || itemLabel) && (
          <h3
            className={`text-sm leading-[21px] ${
              isCurrentRoute && 'text-blue-600'
            }`}
          >
            {itemLabel}
          </h3>
        )}
      </span>
    </a>
  );
};

export const SidebarIconItem = ({ IconComponent, navPath }) => {
  const router = useRouter();
  // get current route
  const currentRoute = router.pathname;
  // check if current route contains navPath
  const isCurrentRoute =
    currentRoute === navPath || (navPath === '/Home' && currentRoute === '/');

  return (
    <Link href={navPath}>
      <span
        className={`relative flex items-center p-4 rounded-xl cursor-pointer ${
          isCurrentRoute ? 'bg-light-blue' : ''
        } hover:bg-gray-200 transition-all duration-300 ease-in-out`}
      >
        {isCurrentRoute && (
          <span className="bg-blue-600 w-1 h-1/2 mr-2 absolute rounded-xl -left-2"></span>
        )}
        <IconComponent fill={isCurrentRoute ? '#145FFF' : '#1C1D20'} />
      </span>
    </Link>
  );
};

const SideBarItem = ({
  Icon,
  label,
  dropdown,
  navPath,
  children,
  toggleMethod,
  toggleState,
}) => {
  const router = useRouter();
  // get current route
  const currentRoute = router.pathname;
  // check if current route contains navPath
  const isCurrentRoute =
    currentRoute === navPath || (navPath === '/Home' && currentRoute === '/');

  return (
    <div
      className={`cursor-pointer ${
        toggleState && 'bg-sidebar-blue rounded-xl'
      } transition-all duration-300 ease-in-out`}
      role="button"
      tabIndex={0}
      onClick={dropdown && toggleMethod}
    >
      <Link href={navPath || '#'}>
        <div
          className={`flex items-center justify-between w-full h-12 hover:cursor-pointer mt-2`}
        >
          <div className={`flex items-center w-full`}>
            <div
              className={`w-1 h-5 mr-1 rounded-3xl ${
                isCurrentRoute ? 'bg-blue-600' : 'bg-transparent'
              }`}
            />
            <div
              className={`flex items-center py-3 px-4 w-full ${
                isCurrentRoute && 'bg-primary-50 rounded-xl'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  isCurrentRoute && 'text-blue-600'
                }`}
              >
                {Icon && <Icon fill={isCurrentRoute ? '#145FFF' : '#1C1D20'} />}
              </div>

              <h3
                className={`font-medium ${
                  isCurrentRoute ? 'text-blue-600 mr-3' : 'font-normal'
                }`}
              >
                {label}
              </h3>
            </div>
          </div>
          {dropdown && (
            <div className="mr-4">
              <ArrowDropDownIcon
                fillColor={toggleState && theme.extend.colors.blue[900]}
              />
            </div>
          )}
        </div>
      </Link>

      {toggleState && <div className="flex flex-col">{children}</div>}
    </div>
  );
};

export default SideBarItem;
