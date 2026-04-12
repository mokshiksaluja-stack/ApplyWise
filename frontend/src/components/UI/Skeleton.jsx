import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
  const baseStyles = 'skeleton-shimmer bg-gray-200';
  const variantStyles = variant === 'circle' ? 'rounded-full' : 'rounded-xl';
  
  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}></div>
  );
};

export default Skeleton;
