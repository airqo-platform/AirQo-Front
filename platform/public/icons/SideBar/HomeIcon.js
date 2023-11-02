import React from 'react';

const HomeIcon = ({ width, height, fill }) => {
  return (
    <svg
      width={width || '24'}
      height={height || '24'}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        id='Icon'
        d='M8.12602 13.9988C8.57006 15.724 10.1362 16.9988 12 16.9988C13.8638 16.9988 15.4299 15.724 15.874 13.9988M11.0177 2.76278L4.23539 8.0379C3.78202 8.39052 3.55534 8.56683 3.39203 8.78764C3.24737 8.98322 3.1396 9.20356 3.07403 9.43783C3 9.7023 3 9.98948 3 10.5638V17.7988C3 18.9189 3 19.4789 3.21799 19.9067C3.40973 20.2831 3.71569 20.589 4.09202 20.7808C4.51984 20.9988 5.07989 20.9988 6.2 20.9988H17.8C18.9201 20.9988 19.4802 20.9988 19.908 20.7808C20.2843 20.589 20.5903 20.2831 20.782 19.9067C21 19.4789 21 18.9189 21 17.7988V10.5638C21 9.98948 21 9.7023 20.926 9.43783C20.8604 9.20356 20.7526 8.98322 20.608 8.78764C20.4447 8.56683 20.218 8.39052 19.7646 8.03791L12.9823 2.76278C12.631 2.48953 12.4553 2.3529 12.2613 2.30038C12.0902 2.25404 11.9098 2.25404 11.7387 2.30038C11.5447 2.3529 11.369 2.48953 11.0177 2.76278Z'
        stroke={fill || '#145FFF'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default HomeIcon;