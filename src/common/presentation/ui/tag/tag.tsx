import React from 'react';

interface TagProps {
  children?: React.ReactNode;
}

export function Tag({ children }: TagProps) {
  return (
    <div className="bg-alpha-grey-200 w-fit rounded-sm px-2 py-0.5 text-[11px]">
      {children}
    </div>
  );
}
