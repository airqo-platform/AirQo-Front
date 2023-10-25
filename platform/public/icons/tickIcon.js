import React from 'react';

const tickIcon = ({ width, height, fill }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width || '24'}
      height={height || '24'}
      viewBox='0 0 24 24'
      fill='none'>
      <path
        d='M20 6L9 17L4 12'
        stroke={fill || '#4B5563'}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};

export default tickIcon;
