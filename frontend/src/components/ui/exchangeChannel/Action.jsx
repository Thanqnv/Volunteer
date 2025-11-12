import React from 'react';

import { cn } from '@/lib/utils.js';

const Action = (props) => {
  const {
    color,
    bg,
    size,
    fontSize,
    fontWeight,
    isDisabled,
    isLoading,
    children,
    block,
  } = props;
  return (
    <button
      {...props}
      className={cn(
        'items-center justify-center rounded-md px-4 shadow-md',
        block ? 'w-full' : 'inline-block',
        size === 'small' ? 'h-7' : size === 'large' ? 'h-11' : 'h-8',
        bg ? bg : 'bg-primary',
        color ? color : 'text-white',
        fontWeight ? fontWeight : 'font-semibold',
        fontSize ? fontSize : 'text-sm',
      )}
      disabled={isDisabled}
    >
      {isLoading ? '...' : children}
    </button>
  );
};

export default Action;